FROM postgres:16-alpine

COPY schema.sql /schema.sql
COPY seed.sql /seed.sql

# Default command: run schema
CMD ["sh", "-c", "PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f /schema.sql"]