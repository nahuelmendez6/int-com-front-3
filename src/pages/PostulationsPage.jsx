import React from 'react';
import PostulationList from '../components/postulations/PostulationList';
import MainLayout from '../components/MainLayout';

const PostulationsPage = () => {
    return (
        <MainLayout>
            <PostulationList />
        </MainLayout>
    );
};

export default PostulationsPage;
