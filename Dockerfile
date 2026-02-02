# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["AplikasiSurat.csproj", "./"]
RUN dotnet restore "AplikasiSurat.csproj"

# Install Node.js
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Copy everything else and build
COPY . .
WORKDIR "/src"
RUN dotnet publish "AplikasiSurat.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expose ports
EXPOSE 80
EXPOSE 443

# Environment variables
ENV ASPNETCORE_URLS=http://+:80

ENTRYPOINT ["dotnet", "AplikasiSurat.dll"]
