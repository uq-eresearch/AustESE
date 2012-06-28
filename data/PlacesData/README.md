PlaceCsvToJson transforms data from the Geoscience Australia Gazetteer 2010 to JSON format for loading into MongoDB.

The source data can be downloaded from: http://www.ga.gov.au/meta/ANZCW0703014255.html

Before running the transformation:
* Remove commas from place names (e.g. using Google Refine, add a text filter on name, filter for comma, edit the handful of names that contain a comma).
* update the properties file with input and output file paths
* increase java heap space

