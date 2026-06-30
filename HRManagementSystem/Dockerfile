FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and restore
COPY ["HRManagementSystem.csproj", "./"]
RUN dotnet restore "HRManagementSystem.csproj"

# Copy everything else and build
COPY . .
RUN dotnet publish "HRManagementSystem.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "HRManagementSystem.dll"]
