import pandas as pd

from datetime import datetime, timedelta

def parseMonthCSV(file):
    df = pd.read_csv(file,
                                skiprows = 5 # skip the first 5 rows
                                )
            
        # Drop the START TIME AND NOTES
    df = df.drop(columns=['START TIME', 'NOTES'])

        # Add 1 minute to each END TIME and rename it to TIME
    df['TIME'] = df['END TIME'].apply(lambda x: (datetime.strptime(x, "%H:%M") + timedelta(minutes=1)).strftime("%H:%M"))
    df = df.drop(columns=["END TIME"])
    df['TYPE'] = df['TYPE'].replace("Electric usage", "Electric")

    print(df.head(10))



def parseAnnualCSV(file):
    df = pd.read_csv(file,
                                skiprows = 5 # skip the first 5 rows
                                )
        
    df = df.drop(columns=['COST', 'START DATE', 'NOTES'])

    df["END DATE"] = pd.to_datetime(df["END DATE"]).dt.to_period("M").astype(str)

    df = df.rename(columns={'END DATE':'DATE'})
    df['TYPE'] = df['TYPE'].replace("Electric billing", "Electric")

    print(df.head(10))







