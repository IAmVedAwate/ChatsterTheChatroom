import sqlite3

# Connect to the SQLite database
conn = sqlite3.connect('chatster.db')
cursor = conn.cursor()

initial_usernames = [
    {'id': 2, 'name': 'ted'},
    {'id': 3, 'name': 'robin'},
    {'id': 4, 'name': 'lily'},
    {'id': 5, 'name': 'marshall'}
]

# Insert the initial usernames into the user_states table
for user in initial_usernames:
    cursor.execute('''
        INSERT INTO user_states (id, username) VALUES (?, ?)
    ''', (user['id'], user['name']))

# Commit changes and close connection
conn.commit()
conn.close()
