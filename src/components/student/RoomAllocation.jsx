import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { BedDouble, Users } from 'lucide-react';

const RoomAllocation = ({ students, onRoomUpdated }) => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('room_number');

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      toast({
        title: "Error fetching rooms",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoomChange = async (studentId, newRoomNumber) => {
    try {
      const { error } = await supabase
        .from('students')
        .update({ room_number: newRoomNumber })
        .match({ id: studentId });

      if (error) throw error;

      toast({
        title: "Room Updated",
        description: "Student's room assignment has been updated successfully.",
      });

      if (onRoomUpdated) {
        onRoomUpdated();
      }
    } catch (error) {
      toast({
        title: "Error updating room",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getRoomOccupancy = (roomNumber) => {
    return students.filter(student => student.room_number === roomNumber).length;
  };

  const getRoomCapacity = (roomNumber) => {
    const room = rooms.find(r => r.room_number === roomNumber);
    return room ? room.capacity : 0;
  };

  return (
    <Card className="shadow-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center text-xl text-primary">
          <BedDouble className="mr-2 h-6 w-6" /> Room Allocation
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-center text-gray-500">Loading room data...</p>
        ) : rooms.length === 0 ? (
          <p className="text-center text-gray-500">No rooms available.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room Number</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Current Occupancy</TableHead>
                  <TableHead>Available Beds</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => {
                  const occupancy = getRoomOccupancy(room.room_number);
                  const availableBeds = room.capacity - occupancy;
                  return (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.room_number}</TableCell>
                      <TableCell>{room.capacity}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4" />
                          {occupancy}
                        </div>
                      </TableCell>
                      <TableCell>{availableBeds}</TableCell>
                      <TableCell>
                        <Select
                          value={selectedRoom}
                          onValueChange={(value) => {
                            setSelectedRoom(value);
                            handleRoomChange(value, room.room_number);
                          }}
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Assign student" />
                          </SelectTrigger>
                          <SelectContent>
                            {students
                              .filter(student => !student.room_number)
                              .map(student => (
                                <SelectItem key={student.id} value={student.id}>
                                  {student.name} ({student.student_id})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RoomAllocation; 