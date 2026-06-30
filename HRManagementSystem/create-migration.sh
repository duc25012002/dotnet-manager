#!/bin/bash
# Script to create and apply migrations

echo "Creating new migration..."
dotnet ef migrations add AddAuthenticationSystem

echo "Updating database..."
dotnet ef database update

echo "Done!"
