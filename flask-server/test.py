import pandas as pd
from models import XGB_MT1R1, LSTM_FINAL

# Load your CSV file into a DataFrame
# Note: CSV must have DateTime as first column and target as second column
df = pd.read_csv('flask-server/asd.csv')

# Test the XGB model function (target is inferred from 2nd column)
xgb_result = XGB_MT1R1(df)
print("XGB_MT1R1 Results:", xgb_result)

# Test the LSTM model function (target is inferred from 2nd column)
lstm_result = LSTM_FINAL(df)
print("LSTM_FINAL Results:", lstm_result)
