import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/config';
import { fetchPostsUseCase } from '../usecases/fetchPosts';
import { FirestorePostRepository } from '../repositories/PostRepository';

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
      <Image
        source={{ uri: item.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg' }}
        style={styles.avatar}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.user}>{item.user}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </View>
    {item.type === 'text' && <Text style={styles.text}>{item.text}</Text>}
    {item.type === 'img' && (
      <Image source={{ uri: item.img }} style={styles.image} />
    )}
    {item.type === 'video' && (
      <View style={styles.videoPlaceholder}><Text style={styles.videoText}>Video</Text></View>
    )}
    <View style={styles.actions}>
      <TouchableOpacity style={styles.actionBtn}><Text style={styles.comment}>Comment</Text></TouchableOpacity>
      <TouchableOpacity style={styles.actionBtn}><Text style={styles.like}>Like</Text></TouchableOpacity>
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

  // Fetch posts using usecase (clean architecture)
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const repo = new FirestorePostRepository();
      const fetchedPosts = await fetchPostsUseCase(repo);
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
  container: {
    flex: 1,
    backgroundColor: '#23272e', // Android Studio dark background
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#80cbc4', // teal accent
    marginBottom: 10,
    alignSelf: 'center',
    letterSpacing: 1,
  },
  item: {
    backgroundColor: '#2d333b', // card dark
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#444857',
    marginRight: 12,
  },
  user: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
  time: {
    color: '#b0bec5',
    fontSize: 12,
    marginTop: 2,
  },
  text: {
    fontSize: 15,
    marginBottom: 8,
    color: '#eceff1',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#37474f',
  },
  videoPlaceholder: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: '#263238',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  videoText: {
    color: '#ffab91',
    fontWeight: 'bold',
    fontSize: 18,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionBtn: {
    backgroundColor: '#37474f',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginLeft: 8,
  },
  comment: {
    color: '#80cbc4',
    fontWeight: 'bold',
    fontSize: 15,
  },
  like: {
    color: '#80cbc4',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default NewsFeedScreen;
