import { useState, useEffect } from 'react';
import { labAPI } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Building2, MapPin, Users, Plus } from 'lucide-react';

export const Labs = () => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLabs();
  }, []);

  const loadLabs = async () => {
    try {
      const response = await labAPI.getAll();
      setLabs(response.data.data);
    } catch (error) {
      console.error('Failed to load labs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading labs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Labs</h1>
            <p className="text-xl text-gray-600">View all available laboratories</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labs.map((lab) => (
            <Card key={lab.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <Building2 className="h-6 w-6 text-blue-600" />
                  <CardTitle>{lab.name}</CardTitle>
                </div>
                <CardDescription className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{lab.location}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Capacity:</span>
                    <span className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{lab.capacity}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="font-medium text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {lab.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  {lab.labManager && (
                    <div className="pt-2 border-t">
                      <span className="text-sm text-gray-600">Manager: </span>
                      <span className="text-sm font-medium">
                        {lab.labManager.firstName} {lab.labManager.lastName}
                      </span>
                    </div>
                  )}
                  <Button className="w-full mt-4" variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {labs.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No labs available</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

