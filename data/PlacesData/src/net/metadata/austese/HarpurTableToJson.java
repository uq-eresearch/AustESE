package net.metadata.austese;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map.Entry;
import java.util.Properties;
import java.util.HashMap;
import au.com.bytecode.opencsv.CSVReader;
import org.bson.types.ObjectId;

public class HarpurTableToJson {
  public static final String WORK_COLLECTION = "works";
  public static final String VERSION_COLLECTION = "versions";
  public static final String ARTEFACT_COLLECTION = "artefacts";
  private static ArrayList<HashMap<String,String>> artefactList = new ArrayList<HashMap<String,String>>();
  private static ArrayList<HashMap<String,String>> versionList = new ArrayList<HashMap<String,String>>();
  private static ArrayList<HashMap<String,String>> workList = new ArrayList<HashMap<String,String>>();
  
  /*
   * Transform Harpur table (copied to CSV from Word Table by pasting into Excel) into JSON
   */

  public static void main(String[] args) {
    try{
        Properties props = new Properties();
        props.load(new FileInputStream("transform.properties"));
        String outputFileName = props.getProperty("harpurOutput");
        String inputFileName = props.getProperty("harpurInput");
        
        CSVReader reader = new CSVReader(new FileReader(inputFileName));
        String [] nextLine;
        //Work no.,Work title,Version no.,Date,First line of version,Title of version,Source,Bib. details
        String versTitle, workTitle="";
        HashMap<String,String> currentWork = null;
        ArrayList<String> currentVersions = new ArrayList<String>();
        while ((nextLine = reader.readNext()) != null) {

            // If this line represents a new work, create a work record
            if (!nextLine[0].equals("")){
                // add list of versions accumulated so far to previous work and then reset
                if (currentVersions.size() != 0 && currentWork != null){
                    StringBuffer cVers = new StringBuffer();
                    cVers.append("[");
                    Iterator<String> it = currentVersions.iterator();
                    while(it.hasNext()){
                        cVers.append("\"" + it.next() + "\"");
                        if (it.hasNext()){
                            cVers.append(", ");
                        }
                    }
                    cVers.append("]");
                    // for each in currentVersions add new ObjectId(currentVersions[i]) to cVers array
                    currentWork.put("versions", cVers.toString());
                    currentVersions.clear();
                }
                currentWork = new HashMap<String,String>();
                currentWork.put("name",nextLine[0]);
                workTitle = nextLine[1];
                currentWork.put("workTitle", replaceStupidCharacters(workTitle));
                workList.add(currentWork);
            }
            
            // Create a version  (don't worry about issues, Harpur project only has to deal with one issue per version)
            HashMap<String,String> v = new HashMap<String,String>();
            String versionId = new ObjectId().toString();
            v.put("_id", "ObjectId('" + versionId + "')");
            // push version id to currentVersions for later linking from work
            currentVersions.add(versionId);
            v.put("name",nextLine[2]);
            v.put("date", nextLine[3]);
            v.put("firstLine", replaceStupidCharacters(nextLine[4]));
            versTitle = nextLine[5];
            if (versTitle.startsWith("^")){
                versTitle = workTitle;
            }
            v.put("versionTitle", replaceStupidCharacters(versTitle));
            versionList.add(v);
            
            // Create an Artefact for each line
            HashMap<String,String> a = new HashMap<String,String>();
            String artefactId = new ObjectId().toString();
            a.put("_id","ObjectId('" + artefactId + "')");
            a.put("source",nextLine[6]);
            a.put("bibDetails", nextLine[7]);
            a.put("date", nextLine[3]);
            artefactList.add(a);
            
            // generate link from version to artefact
            v.put("artefacts", "[\"" + artefactId + "\"]");
        }
        // versions for last work
        if (currentVersions.size() != 0 && currentWork != null){
            StringBuffer cVers = new StringBuffer();
            cVers.append("[");
            Iterator<String> it = currentVersions.iterator();
            while(it.hasNext()){
                cVers.append("\"" + it.next() + "\"");
                if (it.hasNext()){
                    cVers.append(", ");
                }
            }
            cVers.append("]");
            // for each in currentVersions add new ObjectId(currentVersions[i]) to cVers array
            currentWork.put("versions", cVers.toString());
        }
       File outputFile = new File(outputFileName);
       outputFile.delete();
       BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(
               new FileOutputStream(outputFileName), "UTF-8"));
       bw.write("db." + WORK_COLLECTION + ".remove();\n\n");
       for (HashMap<String,String> w : workList) {
         bw.write("db." + WORK_COLLECTION + ".insert(" + mapToString(w) + ");\n");
       }
       bw.write("db." + VERSION_COLLECTION + ".remove();\n\n");
       for (HashMap<String,String> v : versionList) {
         bw.write("db." + VERSION_COLLECTION + ".insert(" + mapToString(v) + ");\n");
       }
       bw.write("db." + ARTEFACT_COLLECTION + ".remove();\n\n");
       for (HashMap<String,String> a : artefactList) {
         bw.write("db." + ARTEFACT_COLLECTION + ".insert(" + mapToString(a) + ");\n");
       }
       //bw.write("\ndb." + COLLECTION_NAME + ".ensureIndex({name: 1});");
       bw.close();
     } catch (IOException e) {
       e.printStackTrace();
     }
  }
  private static String replaceStupidCharacters(String input){
      return input.replaceAll("Ò", "\"\"").replaceAll("Ó", "\"").replaceAll("Ñ", "-").replaceAll("Õ", "'").replaceAll("Ô", "'");
  }
  public static String mapToString(HashMap<String,String> m) {
    StringBuffer revisionsBuffer= new StringBuffer();
    StringBuffer metadataBuffer = new StringBuffer();
    String idProp = "";
    revisionsBuffer.append("{\"project\": \"Harpur\", \"_revisions\":[");
    revisionsBuffer.append("{");
    Iterator<Entry<String,String>> entries = m.entrySet().iterator();
    while (entries.hasNext()) {
       Entry<String,String> entry = entries.next();
       String key = entry.getKey();
       String value = entry.getValue();
       if (!value.startsWith("[\"") && !value.startsWith("ObjectId")){
           value = "\"" + value + "\"";
       }
       if (!key.equals("_id")){
           revisionsBuffer.append(key + ": " + value);
           metadataBuffer.append(key + ": " + value);
           if (entries.hasNext()){
               revisionsBuffer.append(", ");
               metadataBuffer.append(", ");
           }    
       } else {
           idProp = ", \"_id\": " + value;
       }
    }
    revisionsBuffer.append("}], \"metadata\":{");
    revisionsBuffer.append(metadataBuffer.toString());
    revisionsBuffer.append("}");
    revisionsBuffer.append(idProp);
    revisionsBuffer.append("}");
    return revisionsBuffer.toString();
  } 
}
