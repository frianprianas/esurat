namespace AplikasiSurat.Services
{
    public interface IWhatsAppSenderService
    {
        Task SendWhatsAppAsync(string target, string message);
    }

    public class FonnteWhatsAppService : IWhatsAppSenderService
    {
        private readonly string _token = "KQ1XKbd2ZHue4cn9e7hc";
        private readonly string _apiUrl = "https://api.fonnte.com/send";

        public async Task SendWhatsAppAsync(string target, string message)
        {
            if (string.IsNullOrEmpty(target)) return;

            // Clean up target from non-numeric characters
            var cleanTarget = new string(target.Where(char.IsDigit).ToArray());

            // If number starts with 0 (e.g., 0812345...), remove the 0
            if (cleanTarget.StartsWith("0"))
            {
                cleanTarget = cleanTarget.Substring(1);
            }
            // If number starts with 62 (e.g., 62812345...), remove the 62
            else if (cleanTarget.StartsWith("62"))
            {
                cleanTarget = cleanTarget.Substring(2);
            }

            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Authorization", _token);

                var content = new MultipartFormDataContent();
                content.Add(new StringContent(cleanTarget), "target");
                content.Add(new StringContent(message), "message");
                content.Add(new StringContent("62"), "countryCode"); // Always assume Indonesia 62

                try 
                {
                    var response = await client.PostAsync(_apiUrl, content);
                    var responseString = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Fonnte Response for {target}: {responseString}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to send WhatsApp to {target}: {ex.Message}");
                }
            }
        }
    }
}
