import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Searchbar, IconButton, Card, Title, Paragraph, Avatar } from 'react-native-paper';
import database from '@react-native-firebase/database';
import { Toast } from 'toastify-react-native';

const SearchComponent = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return; 

        setLoading(true);
        const query = searchQuery.trim().toLowerCase();

        try {
            const jobsSnapshot = await database().ref('jobs').once('value');
            const eventsSnapshot = await database().ref('events').once('value');

            const jobsData = [];
            const eventsData = [];

            jobsSnapshot.forEach((job) => {
                const jobDetails = job.val();
                jobsData.push({ id: job.key, ...jobDetails });
            });

            eventsSnapshot.forEach((event) => {
                const eventDetails = event.val();
                eventsData.push({ id: event.key, ...eventDetails });
            });

            if (query == 'jobs') {
                setSearchResults([...jobsData])
                console.log([...jobsData])
            }
            else if (query == 'events') {
                setSearchResults([...eventsData])
            }
        } catch (error) {
            Toast.error('Error fetching data from Firebase:', error.message);
        }

        setLoading(false);
    };

    const renderIcon = (type) => {
        if (type === 'job') {
            return <Avatar.Icon size={40} icon="briefcase" style={styles.iconJob} />;
        }
        return <Avatar.Icon size={40} icon="calendar" style={styles.iconEvent} />;
    };

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Search jobs and events..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                style={styles.searchInput}
            />

            <ScrollView style={styles.resultsContainer}>
                {loading && <Text style={styles.loadingText}>Loading...</Text>}
                {searchResults.length === 0 && !loading && (
                    <Text style={styles.noResultsText}>No results found.</Text>
                )}
                {!loading &&
                    searchResults.map((result) => (
                        <Card key={result.id} style={styles.resultCard}>
                            <Card.Title
                                title={result.title}
                                subtitle={result.location
                                    ? `Location: ${result.location || 'unknown'}`
                                    : `Salary: ${result.salary || 'unknown'}`}
                                left={() => renderIcon(result.type)}
                            />

                            <Card.Content>
                                <Title>{result.title}</Title>
                                <Paragraph>{result.description || 'No description available.'}</Paragraph>
                            </Card.Content>
                        </Card>
                    ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#F5F5F5',
        flex: 1,
    },
    searchInput: {
        borderRadius: 30,
        backgroundColor: '#fff',
        elevation: 2,
    },
    resultsContainer: {
        marginTop: 20,
    },
    resultCard: {
        marginBottom: 10,
        backgroundColor: '#fff',
        elevation: 3,
        borderRadius: 8,
    },
    iconJob: {
        backgroundColor: '#4CAF50',
    },
    iconEvent: {
        backgroundColor: '#FF5722',
    },
    loadingText: {
        textAlign: 'center',
        marginVertical: 20,
    },
    noResultsText: {
        textAlign: 'center',
        marginVertical: 20,
        fontStyle: 'italic',
    },
});

export default SearchComponent;
