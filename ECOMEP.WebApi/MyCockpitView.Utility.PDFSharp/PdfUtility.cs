using Newtonsoft.Json;
using PdfSharp.Pdf;
using PdfSharp.Pdf.IO;

namespace MyCockpitView.Utility.PDFSharp;

public class PdfUtility
{

    public static byte[] CombinePDFs(IEnumerable<byte[]> pdfFiles)
    {
        var pdfs = new List<PdfDocument>();

        var options = new PdfReaderOptions
        {
            //Password = "", // if PDFs are password protected
            //h = true // allows continuing even if a page is corrup
            
        };

        foreach (var file in pdfFiles)
        {

            var pdf = PdfReader.Open(new MemoryStream(file), PdfDocumentOpenMode.Import);
            if (pdf.PageCount > 0)
            {
                pdfs.Add(pdf);
            }

        }

        var combinedPdf = new PdfDocument();

        foreach (var pdf in pdfs)
        {
            for (var pageIndex = 0; pageIndex < pdf.PageCount; pageIndex++)
            {
                var page = pdf.Pages[pageIndex];
                combinedPdf.AddPage(page);
            }
        }

        using (var memoryStream = new MemoryStream())
        {
            combinedPdf.Save(memoryStream);
            var combinedPdfBytes = memoryStream.ToArray();
            return combinedPdfBytes;
        }

    }
  
}
