package net.metadata.austese;
import java.io.BufferedWriter;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.DataInputStream;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.Properties;

public class PlaceCsvToJson {
  public static final String COLLECTION_NAME = "places";
  private static ArrayList<Place> placeList = new ArrayList<Place>();
  
  /*
   * Assumes that there are no commas in text fields, 
   * but the dataset does contain a handful in place names - 
   * use Refine to filter and remove them first
   * 
   * Increase heap space before running e.g. add JVM arg -Xmx256m
   */

  public static void main(String[] args) {
    try{
        Properties props = new Properties();
        props.load(new FileInputStream("transform.properties"));
        String outputFileName = props.getProperty("placesOutput");
        String inputFileName = props.getProperty("placesInput");
        FileInputStream fis = new FileInputStream(inputFileName);
        DataInputStream dis = new DataInputStream(fis);
        BufferedReader br = new BufferedReader(new InputStreamReader(dis));
        String currentLine;
        while ((currentLine = br.readLine()) != null) {
            Place p = new Place();
            String [] pVals = currentLine.split(",");
            p.setValues(pVals[1], pVals[3], pVals[4], pVals[5], pVals[9], pVals[13]);
            placeList.add(p);
        }
    
       File outputFile = new File(outputFileName);
       outputFile.delete();
       BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(
               new FileOutputStream(outputFileName), "UTF-8"));
       bw.write("db." + COLLECTION_NAME + ".remove();\n\n");
       for (Place p : placeList) {
           bw.write("db." + COLLECTION_NAME + ".insert(" + p.toString() + ");\n");
       }
       bw.write("\ndb." + COLLECTION_NAME + ".ensureIndex({name: 1});");
       bw.close();
     } catch (IOException e) {
       e.printStackTrace();
     }
  }
}

class Place {
  private String id;
  private String state;
  private String name;
  private String featureCode;
  private String longitude;
  private String latitude;
  
  public void setValues(String id, String state, String name, String featureCode, String longitude, String latitude) {
      this.id = id;
      this.state = state;
      this.name = name;
      this.featureCode = featureCode;
      this.longitude = longitude;
      this.latitude = latitude;
  }

  @Override
  public String toString() {
    StringBuffer sb = new StringBuffer();
    sb.append("{");
    sb.append("_id: \"" + id.replace("\"","") + "\"");
    sb.append(", state: \"" + state.replace("\"","") + "\"");
    sb.append(", name: \"" + name.replace("\"","") + "\"");
    sb.append(", featureCode: \"" + featureCode.replace("\"","") + "\"");
    sb.append(", longitude: \"" + longitude.replace("\"","") + "\"");
    sb.append(", latitude: \"" + latitude.replace("\"","") + "\"");
    sb.append("}");
    return sb.toString();
  } 
}