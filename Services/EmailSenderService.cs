using System.Net;
using System.Net.Mail;

namespace AplikasiSurat.Services
{
    public interface IEmailSenderService
    {
        Task SendEmailAsync(string toEmail, string subject, string body);
    }

    public class EmailSenderService : IEmailSenderService
    {
        private readonly string _host = "smtp.titan.email";
        private readonly int _port = 587;
        private readonly string _username = "baknus@smkbn666.sch.id";
        private readonly string _password = "On5laught?!666";

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            try 
            {
                using (var client = new SmtpClient(_host, _port))
                {
                    client.Timeout = 10000; // 10 seconds timeout
                    client.EnableSsl = true;
                    client.Credentials = new NetworkCredential(_username, _password);
                    
                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(_username),
                        Subject = subject,
                        Body = body,
                        IsBodyHtml = true
                    };
                    mailMessage.To.Add(toEmail);

                    await client.SendMailAsync(mailMessage);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send email to {toEmail}: {ex.Message}");
                // Log error but don't crash the service
            }
        }
    }
}
