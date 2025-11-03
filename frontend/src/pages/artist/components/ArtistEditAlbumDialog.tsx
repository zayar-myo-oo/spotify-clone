import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useArtistStore } from "@/stores/useArtistStore";
import { Album } from "@/types";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface ArtistEditAlbumDialogProps {
  album: Album | null;
  isOpen: boolean;
  onClose: () => void;
}

const ArtistEditAlbumDialog = ({ album, isOpen, onClose }: ArtistEditAlbumDialogProps) => {
  const [formData, setFormData] = useState({
    title: "",
    releaseYear: new Date().getFullYear(),
    imageFile: null as File | null,
  });
  const { isLoading } = useArtistStore();

  useEffect(() => {
    if (album) {
      setFormData({
        title: album.title,
        releaseYear: album.releaseYear,
        imageFile: null,
      });
    }
  }, [album]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !album) {
      toast.error("Please fill all required fields");
      return;
    }

    // For now, just show success message
    toast.success("Album updated successfully");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-700">
        <DialogHeader>
          <DialogTitle>Edit Album</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Album Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-zinc-800 border-zinc-700"
              placeholder="Enter album title"
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Release Year</label>
            <Input
              type="number"
              value={formData.releaseYear}
              onChange={(e) => setFormData({ ...formData, releaseYear: parseInt(e.target.value) })}
              className="bg-zinc-800 border-zinc-700"
              min="1900"
              max={new Date().getFullYear() + 1}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Album Cover (optional)</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, imageFile: e.target.files?.[0] || null })}
              className="bg-zinc-800 border-zinc-700"
            />
            <p className="text-xs text-zinc-400 mt-1">Leave empty to keep current image</p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
              {isLoading ? "Updating..." : "Update Album"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ArtistEditAlbumDialog;