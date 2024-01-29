from flask import Flask, Flask, request, jsonify, render_template, redirect, url_for

app = Flask(__name__)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = {
            'username': request.form['username'],
            'password': request.form['password']
        }
        response = requests.post('http://localhost:8000/users/api/login/', data=data)
        if response.status_code == 200:
            return redirect(url_for('index'))  # Redirect to home page on successful login
        else:
            return "Login Failed", 401
    return render_template('login.html')  # Render the login template

@app.route('/')
def index():
    return render_template('index.html')  # Make sure to create this template

if __name__ == '__main__':
    app.run(debug=True)

@app.route('/tickets', methods=['GET'])
def list_tickets():
    response = requests.get('http://localhost:8000/tickets/api/list/')
    if response.status_code == 200:
        tickets = response.json().get('tickets')
        return render_template('tickets.html', tickets=tickets)  # Render a template with tickets
    else:
        return "Failed to retrieve tickets", 500

@app.route('/add_ticket', methods=['POST'])
def add_ticket():
    data = {
        'title': request.form['title'],
        'description': request.form['description']
        # Add authentication data if needed
    }
    response = requests.post('http://localhost:8000/tickets/api/add/', data=data)
    if response.status_code == 201:
        return redirect(url_for('list_tickets'))  # Redirect to tickets list on successful addition
    else:
        return "Failed to add ticket", 400
@app.route('/tickets', methods=['GET'])
def view_tickets():
    # Make an API call to Django to get tickets
    response = requests.get('http://localhost:8000/api/tickets/')
    tickets = response.json() if response.status_code == 200 else []
    return render_template('view_tickets.html', tickets=tickets)
