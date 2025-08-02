import { Sidebar } from "../components/sidebar";
import { MobileNavigation } from "../components/mobile-navigation";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { CheckSquare, Clock, Star, Calendar } from "lucide-react";

export default function Tasks() {
  return (
    <div className="flex min-h-screen bg-shell-cream">
      <Sidebar />
      <MobileNavigation />

      <div className="flex-1 lg:ml-64 p-4 lg:p-8 pb-20 lg:pb-8">
        <div className="mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-deep-navy mb-2">Tasks</h2>
          <p className="text-moon-gray">Complete tasks to build expertise and earn COW tokens</p>
        </div>

        <div className="space-y-4">
          {/* Sample tasks */}
          {[
            {
              title: "Document Traditional Recipe",
              description: "Record and preserve ancestral cooking methods for community archive",
              priority: "High",
              status: "In Progress",
              cowReward: 45,
              dueDate: "2025-02-05",
              category: "Cultural Preservation"
            },
            {
              title: "Teach Weaving Workshop",
              description: "Lead a community workshop on traditional textile techniques",
              priority: "Medium", 
              status: "Pending",
              cowReward: 120,
              dueDate: "2025-02-08",
              category: "Teaching"
            },
            {
              title: "Elder Care Visit",
              description: "Weekly wellness check and companionship for community elders",
              priority: "High",
              status: "Completed",
              cowReward: 88,
              dueDate: "2025-01-31",
              category: "Care Work"
            },
            {
              title: "Ocean Cleanup Coordination",
              description: "Organize monthly beach cleanup and coordinate volunteers",
              priority: "Medium",
              status: "In Progress", 
              cowReward: 65,
              dueDate: "2025-02-15",
              category: "Environmental Work"
            }
          ].map((task, index) => (
            <Card key={index} className="p-6 border border-ocean-teal/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-deep-navy">{task.title}</h3>
                    <Badge 
                      className={
                        task.status === 'Completed' ? 'bg-green-100 text-green-600' :
                        task.status === 'In Progress' ? 'bg-blue-100 text-blue-600' :
                        'bg-yellow-100 text-yellow-600'
                      }
                    >
                      {task.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-moon-gray mb-3">{task.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-moon-gray">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Due {task.dueDate}</span>
                    </span>
                    <span className="text-ocean-blue">{task.category}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      task.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {task.priority} Priority
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-2">
                    <Star className="w-4 h-4 text-ocean-blue" />
                    <span className="text-ocean-blue font-medium">{task.cowReward} COW</span>
                  </div>
                  <Button 
                    size="sm" 
                    className={
                      task.status === 'Completed' ? 'bg-green-500 hover:bg-green-600' :
                      'bg-gradient-to-r from-ocean-blue to-ocean-teal hover:shadow-md'
                    }
                    disabled={task.status === 'Completed'}
                  >
                    {task.status === 'Completed' ? (
                      <>
                        <CheckSquare className="w-4 h-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 mr-2" />
                        {task.status === 'In Progress' ? 'Continue' : 'Start'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}