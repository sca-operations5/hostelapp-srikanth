
    import React, { useState, useEffect, useCallback } from 'react';
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { useToast } from "@/components/ui/use-toast";
    import { motion } from "framer-motion";
    import { branchesData as branches, getBranchInfrastructure, saveBranchInfrastructure } from '@/utils/hostelData';
    import { Save, Building2, Download, Users, Home, BedDouble, Wind, DoorClosed, Snowflake, Lightbulb, Armchair, Tv, Square, ConciergeBell, Filter, FlaskConical, Microscope, BugOff, Camera, Video, Utensils as CookingPot, Shirt, PlusCircle, BedSingle } from 'lucide-react'; // Added BedSingle
    import { exportToExcel } from '@/utils/exportToExcel';


    const InfrastructureManagement = () => {
      const [selectedBranchId, setSelectedBranchId] = useState(branches[0]?.id || '');
      const [infraData, setInfraData] = useState({});
      const [allInfraData, setAllInfraData] = useState([]);
      const { toast } = useToast();

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

       const fetchAllInfraData = useCallback(() => {
         const data = branches.map(branch => {
           const branchInfra = getBranchInfrastructure(branch.id);
           return { branchId: branch.id, branchName: branch.name, ...branchInfra };
         });
         setAllInfraData(data);
         return data;
       }, []);


      useEffect(() => {
        if (selectedBranchId) {
          setInfraData(getBranchInfrastructure(selectedBranchId));
        }
        fetchAllInfraData();
      }, [selectedBranchId, fetchAllInfraData]);

      const handleBranchChange = (value) => {
        setSelectedBranchId(Number(value));
      };

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInfraData(prev => ({
          ...prev,
          [name]: value === '' ? '' : Number(value) || 0
        }));
      };

      const handleSave = () => {
        if (!selectedBranchId) return;

        const dataToSave = Object.entries(infraData).reduce((acc, [key, value]) => {
          acc[key] = Number(value) || 0;
          return acc;
        }, {});


        saveBranchInfrastructure(selectedBranchId, dataToSave);
        setInfraData(dataToSave);
        fetchAllInfraData();
        toast({
          title: "Infrastructure Saved",
          description: `Details for ${branches.find(b => b.id === selectedBranchId)?.name} have been updated.`,
        });
      };

      const handleExport = () => {
         const dataToExport = allInfraData.map(item => {
            // eslint-disable-next-line no-unused-vars
            const { branchId, ...rest } = item;
            return rest;
          });

         if (dataToExport.length === 0) {
           toast({
             title: "No Data",
             description: "There is no infrastructure data to export.",
             variant: "destructive",
           });
           return;
         }
         exportToExcel(dataToExport, 'Infrastructure_Overview');
         toast({
           title: "Export Successful",
           description: "Infrastructure overview exported to Excel.",
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto p-4 md:p-6 space-y-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-3xl font-bold text-primary">Infrastructure Management</h1>
              <Button onClick={handleExport} variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                 <Download className="mr-2 h-4 w-4" /> Export Overview
               </Button>
          </div>


          <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 shadow-lg border-none">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-primary">
                 <Building2 className="mr-2 h-6 w-6" /> Select Branch and Edit Details
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="max-w-sm">
                  <Label htmlFor="branch-select">Select Branch</Label>
                  <Select onValueChange={handleBranchChange} value={selectedBranchId?.toString() || ''}>
                    <SelectTrigger id="branch-select">
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map(branch => (
                        <SelectItem key={branch.id} value={branch.id.toString()}>{branch.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>

              {selectedBranchId && (
                <div className="space-y-6">
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

                 </div>
              )}

            </CardContent>
            {selectedBranchId && (
               <CardFooter>
                  <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-white">
                      <Save className="mr-2 h-4 w-4" /> Save Changes for {branches.find(b => b.id === selectedBranchId)?.name}
                    </Button>
               </CardFooter>
            )}
          </Card>

           <Card className="shadow-lg border-none">
             <CardHeader>
               <CardTitle className="flex items-center text-xl text-primary">
                 <Building2 className="mr-2 h-6 w-6" /> Infrastructure Overview (All Branches)
               </CardTitle>
             </CardHeader>
             <CardContent>
              {allInfraData.length === 0 ? (
                <p className="text-center text-gray-500">Loading infrastructure data...</p>
              ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                           <tr>
                             <th scope="col" className="px-4 py-3">Branch</th>
                              {capacityItems.map(item => <th scope="col" key={item.key} className="px-2 py-3 text-center">{item.label}</th>)}
                              {infrastructureItems.slice(0, 6).map(item => <th scope="col" key={item.key} className="px-2 py-3 text-center">{item.label}</th>)}
                              <th scope="col" className="px-2 py-3 text-center">...</th>
                            </tr>
                        </thead>
                        <tbody>
                          {allInfraData.map((branchData) => (
                            <tr key={branchData.branchId} className="bg-white border-b hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{branchData.branchName}</td>
                               {capacityItems.map(item => <td key={item.key} className="px-2 py-3 text-center">{branchData[item.key] ?? 0}</td>)}
                               {infrastructureItems.slice(0, 6).map(item => <td key={item.key} className="px-2 py-3 text-center">{branchData[item.key] ?? 0}</td>)}
                               <td className="px-2 py-3 text-center">...</td>
                             </tr>
                          ))}
                        </tbody>
                    </table>
                    <p className="text-xs text-gray-500 mt-2">Showing summary. Full details can be exported.</p>
                </div>
               )}
             </CardContent>
           </Card>

        </motion.div>
      );
    };

    export default InfrastructureManagement;
  