
using Newtonsoft.Json.Linq;
using System.Diagnostics;
using System.Dynamic;
using System.Net;
using System.Text;

namespace MyCockpitView.Utility.ZeptoMailClient;
public class ZeptoEmailUtility
{
    public static void SendEmail(
        string apiAddress,
        string apiKey,
        string subject,
        string senderName,
        string senderAddress,
        string htmlBody,
    List<(string name, string email)> toAddresses,
    List<(string name, string email)>? ccAddresses = null,
    List<(string name, string email)>? bccAddresses = null,
          string? replyAddress=null, string? replyName = null
      )
    {

        var http = (HttpWebRequest)WebRequest.Create(new Uri(apiAddress));
        http.Accept = "application/json";
        http.ContentType = "application/json";
        http.Method = "POST";
        http.PreAuthenticate = true;
        http.Headers.Add("Authorization", apiKey);


        var _toList = string.Empty;
        foreach (var item in toAddresses)
        {
            _toList += (_toList != string.Empty ? "," : string.Empty) + "{\"email_address\": {\"address\": \"" + item.email + "\",\"name\": \"" + item.name + "\"}}";
        }

        var _ccList = string.Empty;
        if (ccAddresses != null)
        {
            foreach (var item in ccAddresses)
            {
                _ccList += (_ccList != string.Empty ? "," : string.Empty) + "{\"email_address\": {\"address\": \"" + item.email + "\",\"name\": \"" + item.name + "\"}}";
            }
        }

        var _bccList = string.Empty;
        if (bccAddresses != null)
        {
            foreach (var item in bccAddresses)
            {
                _bccList += (_bccList != string.Empty ? "," : string.Empty) + "{\"email_address\": {\"address\": \"" + item.email + "\",\"name\": \"" + item.name + "\"}}";
            }
        }

        var jsonstring = "{" +
      "\"from\": { \"address\": \"" +
      senderAddress +
      "\",\"name\":\"" +
      senderName +
      "\"}," +
      "\"to\": [" +
      _toList +
      "]," +
      (_ccList != string.Empty ? "\"cc\": [" + _ccList + "]," : "") +
      (_bccList != string.Empty ? "\"bcc\": [" + _bccList + "]," : "") +
      (!string.IsNullOrEmpty(replyAddress) && !string.IsNullOrEmpty(replyName) ? "\"reply_to\": { \"address\": \"" + replyAddress + "\",\"name\":\"" + replyName + "\"}," : "") +
      "\"subject\":\"" +
      subject +
      "\"," +
      "\"htmlbody\":\"" +
      htmlBody.Replace("\"", "\\\"").Replace("\n", "\\n") +
      "\"" +
      "}";
        JObject parsedContent = JObject.Parse(JToken.Parse(jsonstring).ToString());


        //Console.WriteLine(parsedContent.ToString());
        ASCIIEncoding encoding = new ASCIIEncoding();
        Byte[] bytes = encoding.GetBytes(parsedContent.ToString());


        Stream newStream = http.GetRequestStream();
        newStream.Write(bytes, 0, bytes.Length);
        newStream.Close();

        try
        {
            var response = http.GetResponse();

            var stream = response.GetResponseStream();
            var sr = new StreamReader(stream);
            var content = sr.ReadToEnd();
        }
        catch (Exception e)
        {
            Debug.WriteLine(e.Message + " \n" + e.StackTrace);
            throw new Exception("Email Service error! \n" + e.Message + " \n ");
        }




    }
}
