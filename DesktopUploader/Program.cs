namespace DesktopUploader;

static class Program
{
    [STAThread]
    static void Main(string[] args)
    {
        ApplicationConfiguration.Initialize();
        // Pass arguments to Form1
        Application.Run(new Form1(args));
    }
}