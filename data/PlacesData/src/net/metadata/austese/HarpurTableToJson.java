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
  public static final String EVENT_COLLECTION = "events";
  public static final String MAPPING_COLLECTION = "mappings";
  private static String projectId;
  private static ArrayList<HashMap<String,String>> eventList = new ArrayList<HashMap<String,String>>();
  private static ArrayList<HashMap<String,String>> artefactList = new ArrayList<HashMap<String,String>>();
  private static ArrayList<HashMap<String,String>> versionList = new ArrayList<HashMap<String,String>>();
  private static ArrayList<HashMap<String,String>> workList = new ArrayList<HashMap<String,String>>();
  private static ArrayList<HashMap<String,String>> mappingList = new ArrayList<HashMap<String,String>>();
  private static HashMap<String,ArrayList<String>> artefactParts = new HashMap<String,ArrayList<String>>();
  /*
   * Transform Harpur table (copied to CSV from Word Table by pasting into Excel) into JSON
   */

  public static void main(String[] args) {
    try{
        Properties props = new Properties();
        props.load(new FileInputStream("transform.properties"));
        String outputFileName = props.getProperty("harpurOutput");
        String inputFileName = props.getProperty("harpurInput");
        projectId = props.getProperty("harpurProjectId");
        CSVReader reader = new CSVReader(new FileReader(inputFileName));
        String [] nextLine;
      //Work no.,Work title,Version no.,Date,First line of version,Title of version,Source,Bib. details
      //0 Work no., 1 Work title,2 Version no.,3 Year, 4 Date,5 First line of version,6 Blank, 7 Title of version,8 Source,9 Page no, 10 Notes, 11 Series,  12 lines, 13 ms, 14 url
        String versTitle, workTitle="";
        HashMap<String,String> currentWork = null;
        ArrayList<String> currentVersions = new ArrayList<String>();
        boolean firstLine = true;
        int rowNumber = 0;
        while ((nextLine = reader.readNext()) != null) {
            if (!firstLine){
                rowNumber++;
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
                //if (!nextLine[2].equals("")){
                    // Create a version  (don't worry about issues, Harpur project only has to deal with one issue per version)
                    HashMap<String,String> v = new HashMap<String,String>();
                    String versionId = new ObjectId().toString();
                    v.put("importRowNumber", rowNumber + "");
                    v.put("_id", "{ \"$oid\" : \"" + versionId + "\"}");
                    // push version id to currentVersions for later linking from work
                    currentVersions.add(versionId);
                    String hnum = nextLine[2];
                    v.put("name",hnum);
                    v.put("date", (!nextLine[4].equals("")? nextLine[4] + " ": "") + nextLine[3]);
                    v.put("lines", nextLine[12]);
                    v.put("firstLine", replaceStupidCharacters(nextLine[5]));
                    versTitle = nextLine[7];
                    if (versTitle.startsWith("^")){
                        versTitle = workTitle;
                    } else if (versTitle.trim().equals("-")){
                        versTitle = "Untitled";
                    }
                    v.put("versionTitle", replaceStupidCharacters(versTitle));
                    versionList.add(v);
                    
                    //if (nextLine[2] == null || !nextLine[9].equals("")){
                        // Create an Artefact (part) for each version
                        //8 Source,9 Page no, 10 Notes, 11 Series, 12 Version no, 13 lines, 14 ms, 15 url
                        HashMap<String,String> a = new HashMap<String,String>();
                        String artefactId = new ObjectId().toString();
                        String source = nextLine[8].trim();
                        String pageNumbers = nextLine[9].trim();
                        a.put("importRowNumber", rowNumber + "");
                        a.put("_id","{ \"$oid\" : \"" + artefactId + "\"}");
                        a.put("source", source + (!pageNumbers.equals("") ? " p" + pageNumbers: ""));
                        a.put("pageNumbers", pageNumbers);
                        a.put("description", nextLine[10]); // actually notes field
                        a.put("series", nextLine[11]);
                        a.put("date", (!nextLine[4].equals("")? nextLine[4] + " ": "") + nextLine[3]);
                        artefactList.add(a);
                        
                        // add source,artefact id to artefact parts map
                        if (!source.equals("")){
                            if (artefactParts.containsKey(source)){
                                artefactParts.get(source).add(artefactId);
                            } else {
                                ArrayList<String> parts = new ArrayList<String>();
                                parts.add(artefactId);
                                artefactParts.put(source, parts);
                            }
                        }
                        // Create temporary mappings that will be used later to match uploaded images with artefacts
                        HashMap<String,String> t = new HashMap<String,String>();
                        t.put("hnum", hnum);
                        t.put("artefact",artefactId);
                        t.put("version", versionId);
                        t.put("ms", nextLine[13]);
                        t.put("imageUrl", nextLine[14]);
                        mappingList.add(t);
                        
                        // generate link from version to artefact
                        v.put("artefacts", "[\"" + artefactId + "\"]");
                        if (!nextLine[0].equals("")){
                            // composition event for each work
                            HashMap<String,String> e = new HashMap<String,String>();
                            e.put("artefacts", "[\"" + artefactId + "\"]");
                            e.put("startDate", nextLine[3]);
                        
                            e.put("eventType", "composition");
                            e.put("eventtags", "[\"composition\"]");
                        
                            e.put("name", "\\\"" + replaceStupidCharacters(workTitle) + "\\\"");
                            eventList.add(e);
                        }
                    //}
                //}
            } else {
                firstLine = false;
            }
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
        
        // iterate over artefact parts, if number of parts is more than 1, add an artefact to represent the source
       for (String k : artefactParts.keySet()) {
           ArrayList<String> parts = artefactParts.get(k);
           if (parts.size() > 1){
               String artefactsString = "[";
               for (int j=0; j<parts.size();j++){
                   artefactsString += "\"" + parts.get(j) + "\"";
                   if (j < (parts.size() -1)) {
                       artefactsString += ",";
                   }
               }
               artefactsString += "]";
               HashMap<String,String> a = new HashMap<String,String>();
               String artefactId = new ObjectId().toString();
               a.put("_id","{ \"$oid\" : \"" + artefactId + "\"}");
               a.put("source",k);
               a.put("artefacts", artefactsString);
               artefactList.add(a);
           }
       }
        // write works to file
       File outputFile = new File(outputFileName + WORK_COLLECTION + ".json");
       outputFile.delete();
       outputFile = new File(outputFileName + ARTEFACT_COLLECTION + ".json");
       outputFile.delete();
       outputFile = new File(outputFileName + VERSION_COLLECTION + ".json");
       outputFile.delete();
       outputFile = new File(outputFileName + MAPPING_COLLECTION + ".json");
       outputFile.delete();
       outputFile = new File(outputFileName + EVENT_COLLECTION + ".json");
       outputFile.delete();
       
       BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(
               new FileOutputStream(outputFileName + WORK_COLLECTION + ".json"), "UTF-8"));
       for (HashMap<String,String> w : workList) {
           bw.write(mapToString(w) + "\n");
         }
       bw.close();
        
       bw = new BufferedWriter(new OutputStreamWriter(
               new FileOutputStream(outputFileName + VERSION_COLLECTION + ".json"), "UTF-8"));
       for (HashMap<String,String> v : versionList) {
           bw.write(mapToString(v) + "\n");
       }
       bw.close();
       
       bw = new BufferedWriter(new OutputStreamWriter(
               new FileOutputStream(outputFileName + ARTEFACT_COLLECTION + ".json"), "UTF-8"));
       for (HashMap<String,String> a : artefactList) {
           bw.write(mapToString(a) + "\n");
       }
       bw.close();
       
       bw = new BufferedWriter(new OutputStreamWriter(
               new FileOutputStream(outputFileName + MAPPING_COLLECTION + ".json"), "UTF-8"));
       for (HashMap<String,String> t : mappingList) {
           bw.write(mapToString(t) + "\n");
       }
       bw.close();
       
       bw = new BufferedWriter(new OutputStreamWriter(
               new FileOutputStream(outputFileName + EVENT_COLLECTION + ".json"), "UTF-8"));
       for (HashMap<String,String> e : eventList) {
           bw.write(mapToString(e) + "\n");
       }
       bw.close();

     } catch (IOException e) {
       e.printStackTrace();
     }
  }
  private static String replaceStupidCharacters(String input){
      return input.replaceAll("Ò", "\\\\\"").replaceAll("Ó", "\\\\\"").replaceAll("Ñ", "-").replaceAll("Õ", "'").replaceAll("Ô", "'");
  }
  public static String mapToString(HashMap<String,String> m) {
      
    StringBuffer revisionsBuffer= new StringBuffer();
    StringBuffer metadataBuffer = new StringBuffer();
    String idProp = "";
    revisionsBuffer.append("{\"_revisions\":[");
    revisionsBuffer.append("{\"project\": \"" + projectId + "\",");
    Iterator<Entry<String,String>> entries = m.entrySet().iterator();
    while (entries.hasNext()) {
       Entry<String,String> entry = entries.next();
       String key = entry.getKey();
       String value = entry.getValue();
       if (!value.startsWith("[\"") && !value.startsWith("{")){
           value = "\"" + value + "\"";
       }
       if (!key.equals("_id")){
           revisionsBuffer.append("\"" + key + "\": " + value);
           metadataBuffer.append("\"" + key + "\": " + value);
           if (entries.hasNext()){
               revisionsBuffer.append(", ");
               metadataBuffer.append(", ");
           }    
       } else {
           idProp = ", \"_id\": " + value;
       }
    }
    revisionsBuffer.append("}], \"metadata\":{\"project\":\"" + projectId + "\",");
    revisionsBuffer.append(metadataBuffer.toString());
    revisionsBuffer.append("}");
    revisionsBuffer.append(idProp);
    revisionsBuffer.append("}");
    return revisionsBuffer.toString();
  } 
}
