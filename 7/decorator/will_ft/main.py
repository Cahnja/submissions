from flask import Flask, render_template, request, session, redirect

app = Flask(__name__)
app.secret_key = 'shh do not share'

from functools import wraps
# url : where to redirect on login
def auth(url):
    def wrapper(func):
        @wraps(func)
        def wrapped(*args, **kwargs):
            if 'usern' in session:
                return func(*args, **kwargs)
            else:
                return render_template('login.html', url=url)
        return wrapped
    return wrapper

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    else:
        if request.form['usern'] == 'will' and request.form['passw'] == '123':
            session['usern'] = 'will'
            return redirect(request.form['redirecturl'])
        else:
            return "<h1>nah</h1>"

@app.route('/')
def home():
    return '<a href="/protected">click here to be denied access</a>'

@app.route('/protected')
@auth('/protected')
def protected_stuff():
    return '''<h1>Hey you logged in! 
    This is highly confidential stuff</h1>
    '''

if __name__ == "__main__":
    app.debug = True
    app.run()
