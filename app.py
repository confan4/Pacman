from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///pacman.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class HighScore(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    player_name = db.Column(db.String(50), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'player_name': self.player_name,
            'score': self.score,
            'timestamp': self.timestamp.isoformat()
        }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/scores', methods=['GET'])
def get_high_scores():
    """Get top 10 high scores"""
    scores = HighScore.query.order_by(HighScore.score.desc()).limit(10).all()
    return jsonify([score.to_dict() for score in scores])

@app.route('/api/scores', methods=['POST'])
def save_score():
    """Save a new high score"""
    data = request.get_json()
    
    if not data or 'player_name' not in data or 'score' not in data:
        return jsonify({'error': 'Missing player_name or score'}), 400
    
    player_name = data['player_name'].strip()
    score = data['score']
    
    if not player_name or len(player_name) > 50:
        return jsonify({'error': 'Player name must be 1-50 characters'}), 400
    
    if not isinstance(score, int) or score < 0:
        return jsonify({'error': 'Score must be a non-negative integer'}), 400
    
    high_score = HighScore(player_name=player_name, score=score)
    db.session.add(high_score)
    db.session.commit()
    
    return jsonify(high_score.to_dict()), 201

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
