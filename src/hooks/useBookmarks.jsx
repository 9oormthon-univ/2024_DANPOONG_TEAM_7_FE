// hooks/useBookmarks.js
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchBookmarkLocations, 
    addBookmark, 
    removeBookmark 
} from '../redux/slices/VisitedBookmarkSlice';

export const useBookmarks = () => {
    const dispatch = useDispatch();
    const { 
        bookmarkLocations, 
        isLoading, 
        error 
    } = useSelector(state => state.visitedBookmark);

    const handleFetchBookmarks = useCallback(() => {
        return dispatch(fetchBookmarkLocations());
    }, [dispatch]);

    const handleAddBookmark = useCallback((enterpriseId) => {
        return dispatch(addBookmark(enterpriseId));
    }, [dispatch]);

    const handleRemoveBookmark = useCallback((enterpriseId) => {
        return dispatch(removeBookmark(enterpriseId));
    }, [dispatch]);

    return {
        bookmarks: bookmarkLocations,
        loading: isLoading,
        error,
        fetchBookmarks: handleFetchBookmarks,
        addBookmark: handleAddBookmark,
        removeBookmark: handleRemoveBookmark
    };
};