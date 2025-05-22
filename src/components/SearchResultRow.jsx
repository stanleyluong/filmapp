import { TableCell, TableRow } from "@/components/ui/table"; // Shadcn UI components
import { useTmdbConfig } from '@/hooks/useTmdbConfig'; // Use @ alias
// import { Star } from 'lucide-react'; // No longer needed directly here
import { Link } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating'; // Import the new library

// A simple star rating display component using react-simple-star-rating
const MiniStarRating = ({ rating }) => {
  if (rating === null || typeof rating === 'undefined' || rating === 0) {
    return <span className="text-gray-400 text-xs">N/A</span>;
  }

  const starValue = rating / 2; // Convert 0-10 scale to 0-5 stars

  return (
    <div className="flex items-center justify-center"> {/* Centering the rating display */}
      <Rating
        initialValue={starValue}
        allowFraction
        readonly
        size={16} // Approx h-4. Adjust as needed.
        fillColor="#FFC107" // Standard yellow for stars
        emptyColor="#E0E0E0" // Light gray for empty/background
        SVGstrokeColor="#BDBDBD" // Border for empty stars
        SVGstorkeWidth={1}      // Border width
      />
      <span className="ml-1.5 text-xs text-gray-300">({rating.toFixed(1)})</span>
    </div>
  );
};

const SearchResultRow = ({ item }) => {
  const { getImageUrl } = useTmdbConfig();

  if (!item) return <TableRow><TableCell colSpan={6}>Error: Item data missing.</TableCell></TableRow>;

  const { id, title, name, poster_path, vote_average, media_type, release_date, first_air_date, overview } = item;
  
  const hasPoster = !!poster_path;
  const imageUrl = poster_path ? getImageUrl(poster_path, 'w92') : null; // Set to null if no poster
  const itemMediaType = media_type || (release_date ? 'movie' : 'tv');
  const linkPath = itemMediaType === 'movie' ? `/movie/${id}` : `/tv/${id}`;
  const displayTitle = title || name || 'N/A';
  const date = release_date || first_air_date;
  const year = date ? new Date(date).getFullYear() : 'N/A';
  const truncatedOverview = overview ? (overview.substring(0, 75) + (overview.length > 75 ? '...' : '')) : 'N/A';

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="p-2 text-center align-middle">
        <Link to={linkPath} className="block mx-auto w-10 h-14">
          {hasPoster ? (
            <img 
              src={imageUrl} 
              alt={displayTitle} 
              className="w-full h-full object-cover rounded-sm shadow"
              onError={(e) => { 
                e.target.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.className = "w-full h-full bg-muted/30 text-muted-foreground flex items-center justify-center text-xs rounded-sm shadow";
                fallback.textContent = 'Error';
                e.target.parentNode.appendChild(fallback);
              }}
            />
          ) : (
            <div className="w-full h-full bg-muted/30 text-muted-foreground flex items-center justify-center text-xs rounded-sm shadow">
              No Poster
            </div>
          )}
        </Link>
      </TableCell>
      <TableCell className="p-3 font-medium">
        <Link to={linkPath} className="group">
          <span className="group-hover:text-primary truncate" title={displayTitle}>
            {displayTitle}
          </span>
        </Link>
      </TableCell>
      <TableCell className="p-3 text-sm text-muted-foreground text-center">{year}</TableCell>
      <TableCell className="p-3 text-center">
        <span 
          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            itemMediaType === 'movie' 
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/50' 
              : 'bg-green-600/20 text-green-400 border border-green-500/50'
          }`}
        >
          {itemMediaType === 'movie' ? 'Movie' : 'TV Show'}
        </span>
      </TableCell>
      <TableCell className="p-3 text-sm text-muted-foreground text-center w-[200px]">
        <p className="truncate" title={overview}>{truncatedOverview}</p>
      </TableCell>
      <TableCell className="p-3 text-center">
        <MiniStarRating rating={vote_average} />
      </TableCell>
    </TableRow>
  );
};

export default SearchResultRow; 