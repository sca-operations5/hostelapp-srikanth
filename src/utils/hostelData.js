
    import { Users, Building2, Utensils, Truck, BedDouble, Wind, DoorClosed, Snowflake, Lightbulb, Armchair, Tv, Square, ConciergeBell, Filter, FlaskConical, Microscope, BugOff, Camera, Video, Utensils as CookingPot, Shirt, Home, BedSingle } from 'lucide-react';

    export const branchesData = [
      { id: 1, name: "GODAVARI" },
      { id: 2, name: "SARAYU" },
      { id: 3, name: "GANGA" },
      { id: 4, name: "KRISHNA" },
      { id: 5, name: "BHRAMAPUTRA" },
      { id: 6, name: "SARASWATHI" },
      { id: 7, name: "Science Block" },
      { id: 8, name: "Arts Block" },
      { id: 9, name: "Technology Wing" },
      { id: 10, name: "Sports Complex" },
      { id: 11, name: "Medical Wing" },
      { id: 12, name: "Research Block" },
      { id: 13, name: "Library Block" },
      { id: 14, name: "Innovation Hub" },
      { id: 15, name: "Skill Center" },
      { id: 16, name: "Business Block" },
      { id: 17, name: "Design Wing" },
      { id: 18, name: "Media Center" },
      { id: 19, name: "Language Block" },
      { id: 20, name: "Cultural Center" },
      { id: 21, name: "International Block" },
      { id: 22, name: "Entrepreneurship Hub" }
    ];

    export const floorsData = ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor", "5th Floor"];

    const defaultInfrastructure = {
      rooms: 0, acRooms: 0, beds: 0, fans: 0, lights: 0, chairs: 0,
      digitalBoards: 0, planks: 0, receptionTables: 0, receptionChairs: 0,
      roPlants: 0, labEquipments: 0, mosquitoMeshes: 0, doors: 0, cameras: 0,
      ccCameras: 0, kitchenEquipments: 0, bathroomHangers: 0,
      studentCapacity: 0, roomCapacity: 0,
    };

    export const getBranchInfrastructure = (branchId) => {
      const savedData = localStorage.getItem(`infra_${branchId}`);
      const baseData = { ...defaultInfrastructure };

      if (savedData) {
         try {
           const parsedSaved = JSON.parse(savedData);
           Object.keys(parsedSaved).forEach(key => {
             if (baseData.hasOwnProperty(key) && !isNaN(parsedSaved[key])) {
               baseData[key] = Number(parsedSaved[key]);
             } else if (baseData.hasOwnProperty(key)) {
                baseData[key] = parsedSaved[key];
             }
           });
           return baseData;
         } catch (e) {
           console.error("Error parsing infrastructure data from localStorage:", e);
           localStorage.removeItem(`infra_${branchId}`);
           return { ...defaultInfrastructure };
         }
      }

      return baseData;
    };

    export const saveBranchInfrastructure = (branchId, data) => {
      localStorage.setItem(`infra_${branchId}`, JSON.stringify(data));
    };

    export const calculateDashboardStats = (branches, staffCount = 0, studentCount = 0) => {
      let totalRooms = 0;
      let totalBeds = 0;
      let totalCapacity = 0; // Keep this starting at 0 for the dashboard card

      branches.forEach(branch => {
        const infra = getBranchInfrastructure(branch.id);
        totalRooms += infra.rooms || 0;
        totalBeds += infra.beds || 0;
        // totalCapacity is intentionally kept at 0 for the main dashboard card display
      });

      return [
        { title: "Total Students", value: studentCount.toLocaleString(), icon: Users, color: "bg-blue-500" },
        { title: "Total Staff", value: staffCount.toLocaleString(), icon: Users, color: "bg-purple-500" },
        { title: "Total Capacity", value: totalCapacity.toLocaleString(), icon: Home, color: "bg-teal-500" }, // Displays 0
        { title: "Total Branches", value: branches.length, icon: Building2, color: "bg-green-500" },
        { title: "Total Rooms", value: totalRooms.toLocaleString(), icon: DoorClosed, color: "bg-yellow-500" },
        { title: "Total Beds", value: totalBeds.toLocaleString(), icon: BedDouble, color: "bg-pink-500" },
      ];
    };

    export const calculateComplaintStats = (complaints) => ({
      total: complaints.length,
      pending: complaints.filter(c => c.status === "pending").length,
      inProgress: complaints.filter(c => c.status === "in-progress").length,
      resolved: complaints.filter(c => c.status === "resolved").length,
    });
  