
    import React from 'react';
    import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
    import { Building2, Users, Home } from 'lucide-react';

    const capacityItems = [
      { key: 'studentCapacity', label: 'Student Capacity', icon: Users },
      { key: 'roomCapacity', label: 'Room Capacity', icon: Home },
    ];

    // Select a subset of important infrastructure items for the overview table
    const overviewInfraItems = [
       { key: 'rooms', label: 'Rooms' },
       { key: 'acRooms', label: 'AC Rooms' },
       { key: 'beds', label: 'Beds' },
       { key: 'fans', label: 'Fans' },
       { key: 'lights', label: 'Lights' },
       { key: 'roPlants', label: 'RO Plants' },
    ];


    const InfrastructureOverview = ({ allInfraData }) => {
      return (
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
                           {overviewInfraItems.map(item => <th scope="col" key={item.key} className="px-2 py-3 text-center">{item.label}</th>)}
                           <th scope="col" className="px-2 py-3 text-center">...</th>
                         </tr>
                     </thead>
                     <tbody>
                       {allInfraData.map((branchData) => (
                         <tr key={branchData.branchId} className="bg-white border-b hover:bg-gray-50">
                           <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{branchData.branchName}</td>
                            {capacityItems.map(item => <td key={item.key} className="px-2 py-3 text-center">{branchData[item.key] ?? 0}</td>)}
                            {overviewInfraItems.map(item => <td key={item.key} className="px-2 py-3 text-center">{branchData[item.key] ?? 0}</td>)}
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
      );
    };

    export default InfrastructureOverview;
  