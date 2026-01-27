$content = Get-Content "c:\Users\Francis\ag\projects\Anreal\PREVIEW.html" -Raw

$newEffect = @'
            useEffect(() => {
                const loadItems = () => {
                    if (!window.LOCAL_MOVIES) return false;
                    try {
                        const allMovies = window.LOCAL_MOVIES || [];
                        const query = (genre.search || '').toLowerCase();
                        
                        const filtered = allMovies.filter(movie => {
                            const title = (movie.title || '').toLowerCase();
                            const description = (movie.description || '').toLowerCase();
                            const topics = (Array.isArray(movie.topics)
                                ? movie.topics.filter(Boolean).map(t => t.toLowerCase()).join(' ')
                                : (typeof movie.topics === 'string' ? movie.topics.toLowerCase() : ''));
                            
                            const combinedText = `${title} ${description} ${topics}`;

                            // SEARCH FILTER
                            if (searchTerm && !combinedText.includes(searchTerm.toLowerCase())) {
                                return false;
                            }

                            // GENRE FILTER
                            const cleanQuery = query.replace(/subject:|OR|AND|\(|\)|"/g, ' ').trim();
                            const queryWords = cleanQuery.split(/\s+/).filter(w => w.length > 2);
                            
                            if (queryWords.length === 0) return true;
                            return queryWords.some(w => combinedText.includes(w));
                        });

                        setMovies(filtered.slice(0, 20));
                    } catch (e) {
                        setMovies([]);
                    }
                    setLoading(false);
                    setTimeout(() => lucide.createIcons(), 100);
                    return true;
                };

                if (window.LOCAL_MOVIES) {
                    loadItems();
                } else {
                    const t = setInterval(() => {
                        if (loadItems()) clearInterval(t);
                    }, 100);
                    setTimeout(() => clearInterval(t), 5000);
                }
            }, [genre.id, searchTerm]);
'@

$startTag = 'const MovieRow = ({ genre, onMovieClick, searchTerm }) => {'
$endTag = 'return ('
$startIndex = $content.IndexOf($startTag)
$endIndex = $content.IndexOf($endTag, $startIndex)

if ($startIndex -ge 0 -and $endIndex -gt $startIndex) {
    # Extract the parts before and after the component body
    $before = $content.Substring(0, $startIndex + $startTag.Length)
    $after = $content.Substring($endIndex)
    
    # Construct new component body
    $componentBody = "`n            const [movies, setMovies] = useState([]);`n            const [loading, setLoading] = useState(true);`n            const { ref, isDragging, ...dragProps } = useDraggable();`n`n" + $newEffect + "`n`n            "
    
    $newContent = $before + $componentBody + $after
    $newContent | Set-Content "c:\Users\Francis\ag\projects\Anreal\PREVIEW.html" -NoNewline
    Write-Host "Patched successfully"
}
else {
    Write-Host "Could not find tags: $startIndex, $endIndex"
}
