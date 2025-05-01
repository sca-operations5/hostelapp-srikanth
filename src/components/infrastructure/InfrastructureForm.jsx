
    import React from 'react';
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
    import { Save, Users, Home, BedDouble, Wind, DoorClosed, Snowflake, Lightbulb, Armchair, Tv, Square, ConciergeBell, Filter, FlaskConical, Microscope, BugOff, Camera, Video, Utensils as CookingPot, Shirt, BedSingle } from 'lucide-react';

    const infrastructureItems = [
      { key: 'rooms', label: 'Rooms', icon: DoorClosed, group: 'Rooms & Furnishings' },
      { key: 'acRooms', label: 'AC Rooms', icon: Snowflake, group: 'Rooms & Furnishings' },
      { key: 'beds', label: 'Beds', icon: BedSingle, group: 'Rooms & Furnishings' },
      { key: 'fans', label: 'Fans', icon: Wind, group: 'Rooms & Furnishings' },
      { key: 'lights', label: 'Lights', icon: Lightbulb, group: 'Rooms & Furnishings' },
      { key: 'chairs', label: 'Chairs', icon: Armchair, group: 'Rooms & Furnishings' },
      { key: 'planks', label: 'Planks/Shelves', icon: Square, group: 'Rooms & Furnishings' },
      { key: 'doors', label: 'Doors', icon: DoorClosed, group: 'Rooms & Furnishings' },
      { key: 'mosquitoMeshes', label: 'Mosquito Mesh', icon: BugOff, group: 'Rooms & Furnishings' },
      { key: 'bathroomHangers', label: 'Bathroom Hangers', icon: Shirt, group: 'Rooms & Furnishings' },
      { key: 'receptionTables', label: 'Reception Tables', icon: ConciergeBell, group: 'Common Areas & Equipment' },
      { key: 'receptionChairs', label: 'Reception Chairs', icon: Armchair, group: 'Common Areas & Equipment' },
      { key: 'digitalBoards', label: 'Digital Boards', icon: Tv, group: 'Common Areas & Equipment' },
      { key: 'roPlants', label: 'RO Plants', icon: Filter, group: 'Common Areas & Equipment' },
      { key: 'labEquipments', label: 'Lab Equipment', icon: Microscope, group: 'Common Areas & Equipment' },
      { key: 'cameras', label: 'Cameras (General)', icon: Camera, group: 'Common Areas & Equipment' },
      { key: 'ccCameras', label: 'CC Cameras', icon: Video, group: 'Common Areas & Equipment' },
      { key: 'kitchenEquipments', label: 'Kitchen Equipment', icon: CookingPot, group: 'Common Areas & Equipment' },
    ];

    const capacityItems = [
      { key: 'studentCapacity', label: 'Student Capacity', icon: Users },
      { key: 'roomCapacity', label: 'Room Capacity', icon: Home },
    ];

    const InfrastructureForm = ({ infraData, onDataChange, onSave, branchName }) => {

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        onDataChange({
          ...infraData,
          [name]: value === '' ? '' : Number(value) || 0
        });
      };

      const renderGroupedInputs = (groupName) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {infrastructureItems
            .filter(item => item.group === groupName)
            .map(item => (
              <div key={item.key} className="space-y-1">
                <Label htmlFor={item.key} className="flex items-center text-sm font-medium">
                  <item.icon className="mr-2 h-4 w-4 text-primary/80" /> {item.label}
                </Label>
                <Input
                  id={item.key}
                  name={item.key}
                  type="number"
                  min="0"
                  value={infraData[item.key] ?? ''}
                  onChange={handleInputChange}
                  placeholder="Count"
                />
              </div>
          ))}
        </div>
      );

      return (
        <Card className="shadow-lg border-none">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Edit Details for {branchName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 border-b pb-2 text-primary/90">Capacity</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                 {capacityItems.map(item => (
                   <div key={item.key} className="space-y-1">
                     <Label htmlFor={item.key} className="flex items-center text-sm font-medium">
                       <item.icon className="mr-2 h-4 w-4 text-primary/80" /> {item.label}
                     </Label>
                     <Input
                       id={item.key}
                       name={item.key}
                       type="number"
                       min="0"
                       value={infraData[item.key] ?? ''}
                       onChange={handleInputChange}
                       placeholder="Capacity"
                     />
                   </div>
                 ))}
               </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 border-b pb-2 text-primary/90">Rooms & Furnishings</h3>
               {renderGroupedInputs('Rooms & Furnishings')}
            </div>

             <div>
                 <h3 className="text-lg font-semibold mb-3 border-b pb-2 text-primary/90">Common Areas & Equipment</h3>
                  {renderGroupedInputs('Common Areas & Equipment')}
             </div>
          </CardContent>
          <CardFooter>
            <Button onClick={onSave} className="bg-primary hover:bg-primary/90 text-white">
              <Save className="mr-2 h-4 w-4" /> Save Changes for {branchName}
            </Button>
          </CardFooter>
        </Card>
      );
    };

    export default InfrastructureForm;
  