#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install .NET SDK locally
echo "Downloading and installing .NET SDK..."
curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin --channel 8.0 --install-dir ./dotnet

# Publish the .NET app as a self-contained linux-x64 executable
echo "Publishing self-contained .NET app..."
./dotnet/dotnet publish HRManagementSystem/HRManagementSystem.csproj -c Release -o ./publish -r linux-x64 --self-contained true
