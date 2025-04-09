import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { galleryApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { 
  ImageIcon, 
  Loader2,
  X
} from 'lucide-react';

interface GalleryImage {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  uploadedBy: {
    _id: string;
    username: string;
    fullName: string;
  };
  createdAt: string;
}

const Gallery = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [showLightbox, setShowLightbox] = useState(false);

  // Fetch gallery images
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        setLoading(true);
        const params = selectedCategory ? { category: selectedCategory } : {};
        const response = await galleryApi.getGalleryImages(params);
        if (response.success) {
          setImages(response.data || []);
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to fetch gallery images",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, [selectedCategory]);

  // Get unique categories
  const categories = ['All', ...new Set(images.map(image => image.category))];

  // Handle category filter
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === 'All' ? null : category);
  };

  // Handle image click to show lightbox
  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
    setShowLightbox(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto py-10 px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Gallery</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of images showcasing our club's events, members, and activities.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                (category === 'All' && !selectedCategory) || category === selectedCategory
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin" size={48} />
          </div>
        ) : images.length === 0 ? (
          <Card className="p-8 text-center">
            <ImageIcon size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium mb-2">No Images Found</h3>
            <p className="text-gray-500 mb-4">
              {selectedCategory
                ? `There are no images in the "${selectedCategory}" category.`
                : 'There are no images in the gallery yet.'}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <div
                key={image._id}
                className="group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => handleImageClick(image)}
              >
                <div className="relative pb-[66.67%] overflow-hidden">
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="absolute inset-0 h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-semibold text-gray-800 mb-1 truncate">{image.title}</h3>
                  <p className="text-sm text-gray-500">
                    {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {showLightbox && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              className="absolute top-0 right-0 bg-white rounded-full p-2 shadow-md transform translate-x-1/2 -translate-y-1/2"
              onClick={() => setShowLightbox(false)}
            >
              <X size={20} />
            </button>
            <div className="bg-white rounded-lg overflow-hidden">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="w-full object-contain max-h-[80vh]"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="text-gray-600 mb-4">{selectedImage.description}</p>
                )}
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Category: {selectedImage.category}</span>
                  <span>Added: {new Date(selectedImage.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery; 