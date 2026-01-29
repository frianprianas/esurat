using System;
using System.IO;
using Microsoft.Win32;
using System.Security.Principal;
using System.Diagnostics;

namespace WordPluginInstaller
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("==================================================");
            Console.WriteLine("        INSTALLER PLUGIN WORD E-SURAT        ");
            Console.WriteLine("==================================================");

            // 1. Install to RoamingAppData
            string appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            string installDir = Path.Combine(appData, "ESuratAddin");

            try 
            {
                if (!Directory.Exists(installDir))
                {
                    Directory.CreateDirectory(installDir);
                    Console.WriteLine($"[OK] Folder dibuat: {installDir}");
                }

                // 2. Write Manifest File
                // Embedded XML content to keep it single-exe
                string manifestContent = @"<?xml version=""1.0"" encoding=""UTF-8""?>
<OfficeApp 
  xmlns=""http://schemas.microsoft.com/office/appforoffice/1.1"" 
  xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"" 
  xmlns:bt=""http://schemas.microsoft.com/office/officeappbasictypes/1.0"" 
  xmlns:ov=""http://schemas.microsoft.com/office/taskpaneappversionoverrides/1.0""
  xsi:type=""TaskPaneApp"">

  <Id>3e522961-460d-4008-8959-52e6973e6704</Id>
  <Version>1.0.0.0</Version>
  <ProviderName>E-Surat Corporation</ProviderName>
  <DefaultLocale>en-US</DefaultLocale>
  <DisplayName DefaultValue=""Upload ke E-Surat"" />
  <Description DefaultValue=""Upload dokumen langsung ke server E-Surat."" />
  
  <Hosts>
    <Host Name=""Document"" />
  </Hosts>

  <DefaultSettings>
    <SourceLocation DefaultValue=""http://localhost:5173/word-addin"" />
  </DefaultSettings>

  <Permissions>ReadWriteDocument</Permissions>

  <VersionOverrides xmlns=""http://schemas.microsoft.com/office/taskpaneappversionoverrides/1.0"" xsi:type=""VersionOverridesV1_0"">
    <Hosts>
      <Host xsi:type=""Word"">
        <DesktopFormFactor>
          <GetStarted>
            <Title resid=""GetStarted.Title""/>
            <Description resid=""GetStarted.Description""/>
            <LearnMoreUrl resid=""GetStarted.LearnMoreUrl""/>
          </GetStarted>
          
          <FunctionFile resid=""Taskpane.Url"" />

          <ExtensionPoint xsi:type=""PrimaryCommandSurface"">
            <CustomTab id=""TabESurat"">
              <Group id=""GrpUpload"">
                 <Label resid=""GroupLabel"" />
                 <Icon>
                    <bt:Image size=""16"" resid=""Icon.16x16""/>
                    <bt:Image size=""32"" resid=""Icon.32x32""/>
                    <bt:Image size=""80"" resid=""Icon.80x80""/>
                 </Icon>
                 
                 <Control xsi:type=""Button"" id=""BtnOpenPane"">
                    <Label resid=""TaskpaneButton.Label"" />
                    <Supertip>
                        <Title resid=""TaskpaneButton.Label"" />
                        <Description resid=""TaskpaneButton.Tooltip"" />
                    </Supertip>
                    <Icon>
                        <bt:Image size=""16"" resid=""Icon.16x16""/>
                        <bt:Image size=""32"" resid=""Icon.32x32""/>
                        <bt:Image size=""80"" resid=""Icon.80x80""/>
                    </Icon>
                    <Action xsi:type=""ShowTaskpane"">
                        <TaskpaneId>ButtonId1</TaskpaneId>
                        <SourceLocation resid=""Taskpane.Url"" />
                    </Action>
                 </Control>
              </Group>
              <Label resid=""TabLabel"" />
            </CustomTab>
          </ExtensionPoint>
        </DesktopFormFactor>
      </Host>
    </Hosts>

    <Resources>
      <bt:Images>
        <bt:Image id=""Icon.16x16"" DefaultValue=""http://localhost:5173/vite.svg""/>
        <bt:Image id=""Icon.32x32"" DefaultValue=""http://localhost:5173/vite.svg""/>
        <bt:Image id=""Icon.80x80"" DefaultValue=""http://localhost:5173/vite.svg""/>
      </bt:Images>
      <bt:Urls>
        <bt:Url id=""GetStarted.LearnMoreUrl"" DefaultValue=""http://localhost:5173/"" />
        <bt:Url id=""Taskpane.Url"" DefaultValue=""http://localhost:5173/word-addin"" />
      </bt:Urls>
      <bt:ShortStrings>
        <bt:String id=""GetStarted.Title"" DefaultValue=""Mulai E-Surat Add-in"" />
        <bt:String id=""GroupLabel"" DefaultValue=""E-Surat"" />
        <bt:String id=""TaskpaneButton.Label"" DefaultValue=""Upload Dokumen"" />
        <bt:String id=""TabLabel"" DefaultValue=""E-Surat Tools"" />
      </bt:ShortStrings>
      <bt:LongStrings>
        <bt:String id=""GetStarted.Description"" DefaultValue=""Buka panel untuk upload dokumen."" />
        <bt:String id=""TaskpaneButton.Tooltip"" DefaultValue=""Klik untuk membuka panel upload."" />
      </bt:LongStrings>
    </Resources>
  </VersionOverrides>
</OfficeApp>";
                string manifestPath = Path.Combine(installDir, "manifest.xml");
                File.WriteAllText(manifestPath, manifestContent);
                Console.WriteLine($"[OK] Manifest tersimpan di: {manifestPath}");

                // 3. Register to Trusted Catalog
                // HKEY_CURRENT_USER\Software\Microsoft\Office\16.0\WEF\TrustedCatalogs\{GUID}
                string guid = "3e522961-460d-4008-8959-52e6973e6704"; // Must match Id in Manifest
                string registryPath = $@"Software\Microsoft\Office\16.0\WEF\TrustedCatalogs\{guid}";

                using (RegistryKey key = Registry.CurrentUser.CreateSubKey(registryPath))
                {
                    if (key != null)
                    {
                        key.SetValue("Id", guid);
                        key.SetValue("Url", installDir);
                        key.SetValue("Flags", 1, RegistryValueKind.DWord);
                        Console.WriteLine($"[OK] Registry Registered: {registryPath}");
                    }
                    else
                    {
                        throw new Exception("Gagal membuat registry key.");
                    }
                }
                
                // Clear WEF Cache to force refresh
                 string wefCache = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Microsoft", "Office", "16.0", "Wef");
                 if (Directory.Exists(wefCache)) 
                 {
                     // Attempt to clear cache safely
                     try { /* logic to clear cache if needed, but often simple restart is enough */ } catch {}
                 }

                Console.WriteLine("\n--------------------------------------------------");
                Console.WriteLine("INSTALASI BERHASIL!");
                Console.WriteLine("--------------------------------------------------");
                Console.WriteLine("1. Tutup semua jendela Microsoft Word.");
                Console.WriteLine("2. Buka kembali Word.");
                Console.WriteLine("3. Menu 'E-Surat Tools' akan muncul di Ribbon atau");
                Console.WriteLine("   Masuk ke Insert -> My Add-ins -> Shared Folder -> Upload ke E-Surat");
                Console.WriteLine("\nTekan Enter untuk keluar...");
                Console.ReadLine();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] {ex.Message}");
                Console.WriteLine(ex.StackTrace);
                Console.WriteLine("\nTekan Enter untuk keluar...");
                Console.ReadLine();
            }
        }
    }
}
