from flask import Flask, request, jsonify
import pandas as pd

app = Flask(__name__)


# @app.route('/')
# def index():
#     return render_template('index.html')


@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    # Process CSV file

    # Call method to process CSV using pandas

    try:
        df = pd.read_csv(file)
        # Do some processing with the data, for example, sum a column
        total_sum = df[
            "column_name"
        ].sum()  # Replace 'column_name' with your actual column

        # Respond with some result from the processing
        return jsonify({"total_sum": total_sum})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)

