// This example demonstrates the use of the Landsat 8 QA band
// to mask clouds.  For more information, see the Landsat 8 guide:
// https://landsat.usgs.gov/sites/default/files/documents/Landsat8DataUsersHandbook.pdf

// Load Landsat 8 TOA data.
var l8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA');

// Function to cloud mask from the quality band of Landsat 8.
function maskL8(image) {
  var qa = image.select('BQA');
  // Make a mask to exclude cloudy pixels.
  var mask = qa.bitwiseAnd(ee.Number(2).pow(12).int()).eq(1).and(  // cirrus
             qa.bitwiseAnd(ee.Number(2).pow(13).int()).eq(1)).or(  // cirrus
             qa.bitwiseAnd(ee.Number(2).pow(14).int()).eq(1)).and( // cloud
             qa.bitwiseAnd(ee.Number(2).pow(15).int()).eq(1))      // cloud
             // Negate this.  Don't want high confidence of cloud or cirrus.
             .not();

  return image.updateMask(mask);
}

// Map the function over one year of data and take the median.
var composite = l8.filterDate('2016-01-01', '2016-12-31')
                  .map(maskL8)
                  .median();

// Display the results.
Map.setCenter(-71.0661, 42.324, 12);
Map.addLayer(composite, {bands: ['B4', 'B3', 'B2'], max: 0.3});


