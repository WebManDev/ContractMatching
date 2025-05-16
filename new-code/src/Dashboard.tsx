// src/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';

function Dashboard() {
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const navigate = useNavigate();

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      // If not logged in, redirect to login page
      navigate('/');
      return;
    }
    // Listen to all posts collection
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(loaded);
    });
    return () => unsubscribe();
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;
    try {
      await addDoc(collection(db, 'posts'), {
        userId: user.uid,
        content: content.trim(),
        createdAt: Timestamp.now(),
      });
      setContent('');
    } catch (err) {
      console.error('Error adding post: ', err);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Welcome to your Dashboard</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: '100%', height: '100px', marginBottom: '1rem' }}
        />
        <button type="submit">Post</button>
      </form>
      <div>
        {posts.map(post => (
          <div key={post.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
            <p>{post.content}</p>
            <small>
              Posted by {post.userId} at{' '}
              {(post.createdAt as Timestamp).toDate().toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;