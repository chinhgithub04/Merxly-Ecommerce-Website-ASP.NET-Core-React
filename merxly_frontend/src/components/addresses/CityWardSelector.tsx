import { useState, useEffect } from 'react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import {
  searchCities,
  searchWards,
  getAllCities,
  getWardsByCity,
} from '../../services/addressService';
import type { CityDto, WardDto } from '../../types/models/address';

interface CityWardSelectorProps {
  selectedCityCode: number | null;
  selectedCityName: string;
  selectedWardCode: number | null;
  selectedWardName: string;
  onCityChange: (code: number, name: string) => void;
  onWardChange: (code: number, name: string) => void;
}

export const CityWardSelector = ({
  selectedCityCode,
  selectedCityName,
  selectedWardCode,
  selectedWardName,
  onCityChange,
  onWardChange,
}: CityWardSelectorProps) => {
  // City state
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [isCityOpen, setIsCityOpen] = useState(false);

  // Ward state
  const [wardSearchTerm, setWardSearchTerm] = useState('');
  const [isWardOpen, setIsWardOpen] = useState(false);

  // Fetch cities based on search
  const { data: cities = [], isLoading: isLoadingCities } = useQuery({
    queryKey: ['cities', citySearchTerm],
    queryFn: () =>
      citySearchTerm ? searchCities(citySearchTerm) : getAllCities(),
    enabled: isCityOpen,
  });

  // Fetch wards based on city and search
  const { data: wards = [], isLoading: isLoadingWards } = useQuery({
    queryKey: ['wards', selectedCityCode, wardSearchTerm],
    queryFn: () => {
      if (!selectedCityCode) return Promise.resolve([]);
      if (wardSearchTerm) {
        return searchWards(wardSearchTerm, selectedCityCode);
      }
      return getWardsByCity(selectedCityCode);
    },
    enabled: isWardOpen && !!selectedCityCode,
  });

  // Reset ward when city changes
  useEffect(() => {
    if (selectedCityCode) {
      // When city changes, clear ward selection
      onWardChange(0, '');
    }
  }, [selectedCityCode]);

  const handleCitySelect = (city: CityDto) => {
    onCityChange(city.code, city.name);
    setIsCityOpen(false);
    setCitySearchTerm('');
  };

  const handleWardSelect = (ward: WardDto) => {
    onWardChange(ward.code, ward.name);
    setIsWardOpen(false);
    setWardSearchTerm('');
  };

  const handleClearCity = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCityChange(0, '');
    setCitySearchTerm('');
  };

  const handleClearWard = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWardChange(0, '');
    setWardSearchTerm('');
  };

  return (
    <div className='grid grid-cols-2 gap-4'>
      {/* City Selector */}
      <div className='relative'>
        <label className='block text-sm font-medium text-neutral-700 mb-1'>
          City / Province <span className='text-red-500'>*</span>
        </label>
        <button
          type='button'
          onClick={() => setIsCityOpen(!isCityOpen)}
          className='cursor-pointer w-full px-3 py-2 border border-neutral-300 rounded-md text-left bg-white hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 flex items-center justify-between gap-2'
        >
          <span className='text-sm text-neutral-900 flex-1 truncate'>
            {selectedCityName || 'Select city'}
          </span>
          <div className='flex items-center gap-1'>
            {selectedCityName && (
              <span
                onClick={handleClearCity}
                className='cursor-pointer p-0.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded transition-colors'
              >
                <XMarkIcon className='w-4 h-4' />
              </span>
            )}
            <ChevronDownIcon className='w-4 h-4 text-neutral-400' />
          </div>
        </button>

        {isCityOpen && (
          <>
            <div
              className='fixed inset-0 z-10'
              onClick={() => setIsCityOpen(false)}
            />
            <div className='absolute z-20 mt-2 w-full bg-white border border-neutral-200 rounded-lg shadow-xl max-h-80 overflow-hidden'>
              <div className='p-3 border-b border-neutral-100'>
                <input
                  type='text'
                  placeholder='Search city...'
                  value={citySearchTerm}
                  onChange={(e) => setCitySearchTerm(e.target.value)}
                  className='w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
                  autoFocus
                />
              </div>
              <div className='overflow-y-auto max-h-64'>
                {isLoadingCities ? (
                  <div className='p-4 text-center text-sm text-neutral-500'>
                    Loading...
                  </div>
                ) : cities.length === 0 ? (
                  <div className='p-4 text-center text-sm text-neutral-500'>
                    No cities found
                  </div>
                ) : (
                  cities.map((city) => (
                    <button
                      key={city.code}
                      type='button'
                      onClick={() => handleCitySelect(city)}
                      className={`cursor-pointer w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 transition-colors ${
                        selectedCityCode === city.code
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-neutral-700'
                      }`}
                    >
                      {city.name}
                    </button>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Ward Selector */}
      <div className='relative'>
        <label className='block text-sm font-medium text-neutral-700 mb-1'>
          Ward / District <span className='text-red-500'>*</span>
        </label>
        <button
          type='button'
          onClick={() => selectedCityCode && setIsWardOpen(!isWardOpen)}
          disabled={!selectedCityCode}
          className='cursor-pointer w-full px-3 py-2 border border-neutral-300 rounded-md text-left bg-white hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 flex items-center justify-between gap-2 disabled:bg-neutral-50 disabled:cursor-not-allowed disabled:text-neutral-400'
        >
          <span className='text-sm flex-1 truncate'>
            {selectedWardName || 'Select ward'}
          </span>
          <div className='flex items-center gap-1'>
            {selectedWardName && selectedCityCode && (
              <span
                onClick={handleClearWard}
                className='cursor-pointer p-0.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded transition-colors'
              >
                <XMarkIcon className='w-4 h-4' />
              </span>
            )}
            <ChevronDownIcon className='w-4 h-4 text-neutral-400' />
          </div>
        </button>

        {isWardOpen && selectedCityCode && (
          <>
            <div
              className='fixed inset-0 z-10'
              onClick={() => setIsWardOpen(false)}
            />
            <div className='absolute z-20 mt-2 w-full bg-white border border-neutral-200 rounded-lg shadow-xl max-h-80 overflow-hidden'>
              <div className='p-3 border-b border-neutral-100'>
                <input
                  type='text'
                  placeholder='Search ward...'
                  value={wardSearchTerm}
                  onChange={(e) => setWardSearchTerm(e.target.value)}
                  className='w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
                  autoFocus
                />
              </div>
              <div className='overflow-y-auto max-h-64'>
                {isLoadingWards ? (
                  <div className='p-4 text-center text-sm text-neutral-500'>
                    Loading...
                  </div>
                ) : wards.length === 0 ? (
                  <div className='p-4 text-center text-sm text-neutral-500'>
                    No wards found
                  </div>
                ) : (
                  wards.map((ward) => (
                    <button
                      key={ward.code}
                      type='button'
                      onClick={() => handleWardSelect(ward)}
                      className={`cursor-pointer w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 transition-colors ${
                        selectedWardCode === ward.code
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-neutral-700'
                      }`}
                    >
                      {ward.name}
                    </button>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
