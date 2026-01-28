













--- a/src/App.js
+++ b/src/App.js
@@ -12,6 +12,7 @@
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [activePage, setActivePage] = useState('home');
+    const [searchQuery, setSearchQuery] = useState('');

    const handleRandomWatch = () => {
        if (allMovies && allMovies.length > 0) {



@@ -48,6 +49,10 @@
        }
    };































+    const handleSearch = (query) => {
+        setSearchQuery(query);
+    };
+
    // Filter genres for Home page
    const displayGenres = selectedGenre ? [selectedGenre] : GENRES;


@@ -55,12 +60,13 @@
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-red-600 selection:text-white">
            <Navbar activePage={activePage} setActivePage={setActivePage} />




-            <main className="relative z-10 pt-16">
-                {activePage === 'home' && (
+           <Navbar
+                activePage={activePage}
+                setActivePage={setActivePage}
+                onSearch={handleSearch}
+            />
+
+            <main className="relative z-10 pt-16">{activePage === 'home' && !searchQuery && (
                     <>
                        <Hero onRandomWatch={handleRandomWatch} />
                        <GenreBar onGenreSelect={handleGenreSelect} selectedGenre={selectedGenre} />












@@ -77,7 +83,7 @@
                    </>
                )}


-                {activePage === 'movies' && (
+                {activePage === 'home' && searchQuery && (
                    <div className="pt-8">
                        <MovieGrid
                            title="The Vault"



























































