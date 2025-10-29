import pandas as pd
from sqlalchemy import create_engine
from geoalchemy2 import Geography

# DB connection
DATABASE_URL = "postgresql://postgres:@localhost:5432/turburoute"
engine = create_engine(DATABASE_URL)

# Load CSV
df = pd.read_csv('../../data/sample_weather.csv')

# Convert lat/lon to WKT point
df['geom'] = df.apply(lambda row: f"SRID=4326;POINT({row['lon']} {row['lat']})", axis=1)

# Write to PostGIS table
df.to_sql(
    'weather_points',
    con=engine,
    if_exists='replace',  # or 'append'
    index=False,
    dtype={'geom': Geography('POINT', srid=4326)}
)

print("Sample weather data loaded into PostGIS!")
