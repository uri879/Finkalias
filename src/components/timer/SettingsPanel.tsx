import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import type { TimerSettings } from '@/types/timer';

interface SettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: TimerSettings;
  onChange: (settings: TimerSettings) => void;
  onApply: () => void;
}

export function SettingsPanel({
  open,
  onOpenChange,
  settings,
  onChange,
  onApply,
}: SettingsPanelProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>הגדרות זמן</SheetTitle>
          <SheetDescription>הגדר את משכי הזמן לכל שלב במשחק</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 mt-6">
          <div>
            <label className="text-sm font-medium">זמן תור (שניות)</label>
            <input
              type="number"
              value={settings.turnTime}
              onChange={(e) =>
                onChange({ ...settings, turnTime: parseInt(e.target.value) || 60 })
              }
              className="w-full mt-1 px-3 py-2 border rounded-md"
              min="10"
              max="300"
            />
          </div>
          <div>
            <label className="text-sm font-medium">זמן ניחושים (שניות)</label>
            <input
              type="number"
              value={settings.guessTime}
              onChange={(e) =>
                onChange({ ...settings, guessTime: parseInt(e.target.value) || 30 })
              }
              className="w-full mt-1 px-3 py-2 border rounded-md"
              min="5"
              max="120"
            />
          </div>
          <div>
            <label className="text-sm font-medium">זמן תור מיוחד (שניות)</label>
            <input
              type="number"
              value={settings.specialTurnTime}
              onChange={(e) =>
                onChange({ ...settings, specialTurnTime: parseInt(e.target.value) || 45 })
              }
              className="w-full mt-1 px-3 py-2 border rounded-md"
              min="10"
              max="300"
            />
          </div>
          <Button
            onClick={() => {
              onApply();
              onOpenChange(false);
            }}
            className="w-full mt-3"
            variant="outline"
          >
            עדכן
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
