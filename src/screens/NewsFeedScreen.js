import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const SAMPLE_POSTS = [
  {
    user: 'Raynor',
    time: '14:00',
    text: 'Text, Text, Text Text, Text, Text Text, Text, Text',
    type: 'text',
  },
  {
    user: 'Kerrigan',
    time: '10:00',
    text: '',
    type: 'img',
    img: 'https://i.pinimg.com/736x/fa/27/7d/fa277de6b142ab701dffda5d2279e5ca.jpg',
  },
  {
    user: 'Zeratul',
    time: '04.05',
    text: 'Text, Text, Text Text, Text, Text Text, Text, Text',
    type: 'text',
  },
  {
    user: 'Tassadar',
    time: '03.05',
    text: 'Text',
    type: 'video',
    video: 'https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4',
  },
];

const FeedItem = ({ item }) => (
  <View style={styles.item}>
    <View style={styles.header}>
      <View style={styles.avatar} />
      <Text style={styles.user}>{item.user}</Text>
      <Text style={styles.time}>{item.time}</Text>
    </View>
    {item.type === 'text' && <Text style={styles.text}>{item.text}</Text>}
    {item.type === 'img' && (
      <Image source={{ uri: item.img }} style={styles.image} />
    )}
    {item.type === 'video' && (
      <View style={styles.videoPlaceholder}><Text style={styles.videoText}>Video</Text></View>
    )}
    <View style={styles.actions}>
      <TouchableOpacity><Text style={styles.comment}>Comment</Text></TouchableOpacity>
      <TouchableOpacity><Text style={styles.like}>Like</Text></TouchableOpacity>
    </View>
  </View>
);

const NewsFeedScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeded, setSeeded] = useState(false);

  // Function to seed Firestore with sample posts
  const seedFirestore = async () => {
    try {
      const postsCollection = collection(db, 'posts');
      for (const post of SAMPLE_POSTS) {
        await addDoc(postsCollection, post);
      }
      setSeeded(true);
      fetchPosts();
    } catch (error) {
      console.error('Error seeding Firestore:', error);
    }
  };

  // Fetch posts from Firestore
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const postsCollection = collection(db, 'posts');
      const snapshot = await getDocs(postsCollection);
      const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>News Feed</Text>
      {!seeded && (
        <Button title="Seed Firestore with Sample Posts" onPress={seedFirestore} />
      )}
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => <FeedItem item={item} />}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1976d2', marginBottom: 10, alignSelf: 'center' },
  item: { backgroundColor: '#f9f9f9', padding: 16, marginVertical: 8, marginHorizontal: 16, borderRadius: 12, elevation: 2 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#e0e0e0', marginRight: 8 },
  user: { fontWeight: 'bold', fontSize: 16, marginRight: 8 },
  time: { color: '#888', fontSize: 12 },
  text: { fontSize: 15, marginBottom: 8 },
  image: { width: '100%', height: 150, borderRadius: 8, marginBottom: 8 },
  videoPlaceholder: { width: '100%', height: 150, borderRadius: 8, backgroundColor: '#ffe0e0', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  videoText: { color: '#d32f2f', fontWeight: 'bold', fontSize: 18 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end' },
  comment: { color: '#1976d2', marginRight: 16 },
  like: { color: '#1976d2' },
});

export default NewsFeedScreen;
