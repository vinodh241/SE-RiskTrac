FROM mcr.microsoft.com/mssql/server:2022-latest

# Set environment variables for SQL Server
ENV ACCEPT_EULA=Y
ENV MSSQL_SA_PASSWORD=YourStrong@Passw0rd
ENV MSSQL_PID=Developer

# Create directory for database files
RUN mkdir -p /var/opt/mssql/data && \
    chown -R mssql:mssql /var/opt/mssql

# Expose SQL Server port
EXPOSE 1433

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P $MSSQL_SA_PASSWORD -Q "SELECT 1" || exit 1

# Start SQL Server
CMD ["/opt/mssql/bin/sqlservr"]