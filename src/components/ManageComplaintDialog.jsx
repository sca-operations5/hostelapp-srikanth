import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '../lib/supabaseClient';
import { useToast } from "@/components/ui/use-toast";

function ManageComplaintDialog({ complaint, onUpdate, children }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cost, setCost] = useState(complaint.cost || '');
  const [comment, setComment] = useState(complaint.resolution_comment || '');
  const [expectedDate, setExpectedDate] = useState(
    complaint.expected_resolution_date
      ? new Date(complaint.expected_resolution_date).toISOString().slice(0, 16)
      : ''
  );
  const [resolveNow, setResolveNow] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setCost(complaint.cost || '');
        setComment(complaint.resolution_comment || '');
        setExpectedDate(
            complaint.expected_resolution_date
            ? new Date(complaint.expected_resolution_date).toISOString().slice(0, 16)
            : ''
        );
        setResolveNow(complaint.status === 'Resolved');
    }
  }, [isOpen, complaint]);

  const handleSubmit = async (markAsResolved) => {
    setIsSubmitting(true);

    const updateData = {
      cost: cost === '' ? null : parseFloat(cost),
      resolution_comment: comment.trim() === '' ? null : comment.trim(),
      expected_resolution_date: expectedDate === '' ? null : new Date(expectedDate).toISOString(),
    };

    if (markAsResolved) {
      updateData.status = 'Resolved';
      updateData.resolved_at = new Date().toISOString();
      updateData.resolved_by_user_id = null;
    } else {
        if (complaint.status !== 'Resolved') {
             updateData.status = 'New';
         }
    }

    try {
      const { error } = await supabase
        .from('complaints')
        .update(updateData)
        .eq('id', complaint.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Complaint ${markAsResolved ? 'resolved' : 'updated'} successfully.`,
      });
      setIsOpen(false);
      onUpdate();

    } catch (error) {
      console.error("Error updating complaint:", error);
      toast({
        title: "Error",
        description: `Failed to update complaint: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Complaint #{complaint.id}</DialogTitle>
          <DialogDescription>
            Update details or mark the complaint as resolved. Current status: {complaint.status}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cost" className="text-right">
              Cost (INR)
            </Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="col-span-3"
              placeholder="e.g., 150.50"
              disabled={isSubmitting || complaint.status === 'Resolved'}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="comment" className="text-right">
              Comment
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="col-span-3"
              placeholder="Add resolution notes or reason for delay..."
              disabled={isSubmitting || complaint.status === 'Resolved'}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expectedDate" className="text-right">
              Expected Date
            </Label>
            <Input
              id="expectedDate"
              type="datetime-local"
              value={expectedDate}
              onChange={(e) => setExpectedDate(e.target.value)}
              className="col-span-3"
              disabled={isSubmitting || complaint.status === 'Resolved'}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
             <Button type="button" variant="secondary" disabled={isSubmitting}>
                Cancel
             </Button>
          </DialogClose>
          
          <div className="flex gap-2">
            {complaint.status !== 'Resolved' && (
                <Button
                    type="button"
                    onClick={() => handleSubmit(false)}
                    disabled={isSubmitting}
                    variant="outline"
                >
                    {isSubmitting ? "Saving..." : "Save Details Only"}
                </Button>
            )}
            {complaint.status !== 'Resolved' && (
              <Button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Resolving..." : "Mark as Resolved"}
              </Button>
            )}
             {complaint.status === 'Resolved' && (
                 <span className="text-sm text-muted-foreground italic">Complaint already resolved.</span>
             )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ManageComplaintDialog; 