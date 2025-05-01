
    import React from 'react';
    import { Label } from "@/components/ui/label";
    import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Building2 } from 'lucide-react';

    const BranchSelector = ({ branches, selectedBranchId, onBranchChange }) => {
      return (
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 shadow-lg border-none">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-primary">
              <Building2 className="mr-2 h-6 w-6" /> Select Branch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-sm">
              <Label htmlFor="branch-select">Select Branch to View/Edit Details</Label>
              <Select onValueChange={onBranchChange} value={selectedBranchId?.toString() || ''}>
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
          </CardContent>
        </Card>
      );
    };

    export default BranchSelector;
  