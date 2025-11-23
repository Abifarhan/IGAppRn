import React, { useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { useNewsFeedViewModel } from './useNewsFeedViewModel';

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
  const { posts, loading, error, fetchPosts, setPosts, seedPosts, loadMore, hasMore } = useNewsFeedViewModel();

  

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>News Feed</Text>
      <Text style={{ color: '#9e9e9e', alignSelf: 'center' }}>Posts: {posts.length}</Text>
      {error && <Text style={{ color: 'orange', alignSelf: 'center' }}>Last error: {error && error.message}</Text>}
      
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text style={{ color: 'red' }}>Error: {error.message}</Text>
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => <FeedItem item={item} />}
          keyExtractor={item => item.id}
        />
      )}
      {hasMore && <Button title="Load more" onPress={() => loadMore()} />}

      {__DEV__ && (
        <Button title="Seed" onPress={() => {
          const sample = [
            { user: 'Sys', type: 'text', text: 'Seeded post', time: 'now', createdAt: new Date() }
          ];
          seedPosts(sample).then(r => {
            console.log('[Screen] seed result', r);
            try {
              if (r && r.ok && Array.isArray(r.value) && r.value.length > 0) {
                const ref = r.value[0];
                const id = ref && ref.id ? ref.id : String(Date.now());
                const optimistic = { id, user: sample[0].user, type: sample[0].type, text: sample[0].text, time: new Date().toISOString(), avatar: null };
                setPosts(prev => [optimistic, ...prev]);
              }
            } catch (e) {
              console.log('[Screen] seed optimistic update failed', e);
            }
          });
        }} />
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
