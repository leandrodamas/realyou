
import React, { useState, useEffect } from "react";
import TimelineHeader from "@/components/timeline/TimelineHeader";
import TimelineTabs from "@/components/timeline/TimelineTabs";
import TimelineStats from "@/components/timeline/TimelineStats";
import TimelineFilters from "@/components/timeline/TimelineFilters";
import VisualTimeline from "@/components/calendar/VisualTimeline";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, DollarSign, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfileStorage } from "@/hooks/facial-recognition/useProfileStorage";
import { toast } from "sonner";

const TimelinePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointmentFilters, setAppointmentFilters] = useState<string[]>(["scheduled", "free", "buffer", "blocked"]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "Seu Perfil",
    title: "Profissional",
    avatar: null,
    basePrice: 180,
    location: "São Paulo",
    rating: 4.9
  });
  
  const { getProfile } = useProfileStorage();
  
  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true);
      try {
        // Get profile from storage
        const storedProfile = getProfile();
        
        // Get user session
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user?.id;
        
        if (userId) {
          // Try to get service pricing data
          const { data: pricingData } = await supabase
            .from('service_pricing')
            .select('*')
            .eq('user_id', userId)
            .single();
            
          // Update profile data with real information
          setProfileData({
            name: storedProfile?.fullName || "Seu Perfil",
            title: storedProfile?.title || "Profissional",
            avatar: storedProfile?.profileImage || null,
            basePrice: pricingData?.base_price || storedProfile?.basePrice || 180,
            location: storedProfile?.location || "São Paulo",
            rating: 4.9
          });
        } else if (storedProfile) {
          // Fallback to stored profile if no user session
          setProfileData({
            name: storedProfile.fullName || "Seu Perfil",
            title: storedProfile.title || "Profissional",
            avatar: storedProfile.profileImage || null,
            basePrice: storedProfile.basePrice || 180,
            location: storedProfile.location || "São Paulo",
            rating: 4.9
          });
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
        toast.error("Erro ao carregar dados do perfil");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfileData();
    
    // Listen for profile updates
    const handleProfileUpdate = () => {
      loadProfileData();
    };
    
    document.addEventListener('profileUpdated', handleProfileUpdate);
    
    return () => {
      document.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [getProfile]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleFiltersChange = (filters: string[]) => {
    setAppointmentFilters(filters);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <TimelineHeader />
      <TimelineTabs />
      <TimelineStats />
      
      <div className="p-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Seu Perfil Profissional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                {profileData.avatar ? (
                  <AvatarImage src={profileData.avatar} />
                ) : (
                  <AvatarFallback>{profileData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="font-medium text-lg">{profileData.name}</h3>
                <p className="text-gray-600">{profileData.title}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    <Star className="h-3 w-3 mr-1 fill-yellow-500" />
                    {profileData.rating}
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    <DollarSign className="h-3 w-3 mr-1" />
                    R${profileData.basePrice}/hora
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <MapPin className="h-3 w-3 mr-1" />
                    {profileData.location}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <TimelineFilters 
          selectedDate={selectedDate} 
          onDateChange={handleDateChange}
          appointmentFilters={appointmentFilters}
          onFiltersChange={handleFiltersChange}
        />
        
        <div className="mt-4">
          <VisualTimeline 
            initialDate={selectedDate}
            filters={appointmentFilters}
            onFiltersChange={handleFiltersChange}
          />
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;
