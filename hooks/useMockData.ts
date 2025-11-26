
import { useMemo } from 'react';
import { User, ServiceName, UserStatus } from '../types';

const generateUsers = (count: number, inactivityPeriod: number): User[] => {
  const users: User[] = [];
  const services = Object.values(ServiceName);
  const firstNames = ['John', 'Jane', 'Alex', 'Emily', 'Chris', 'Katie', 'Michael', 'Sarah', 'David', 'Laura'];
  const lastNames = ['Smith', 'Doe', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez'];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random()*100)}@example.com`;
    const service = services[Math.floor(Math.random() * services.length)];
    
    // ~70% chance of being active, ~30% inactive
    const isActive = Math.random() < 0.7;
    const daysAgo = isActive
      ? Math.floor(Math.random() * inactivityPeriod)
      : inactivityPeriod + Math.floor(Math.random() * 100);

    const lastActive = new Date();
    lastActive.setDate(lastActive.getDate() - daysAgo);

    let status = UserStatus.Active;
    if (daysAgo >= inactivityPeriod) {
        // ~10% of inactive are pending deactivation
        status = Math.random() < 0.1 ? UserStatus.PendingDeactivation : UserStatus.Inactive;
    }

    users.push({
      id: `user-${i}`,
      name,
      email,
      service,
      lastActive,
      status,
      avatar: `https://i.pravatar.cc/150?u=${email}`
    });
  }
  return users;
};

const useMockData = () => {
  const inactivityPeriod = 90; // days

  const users = useMemo(() => generateUsers(250, inactivityPeriod), [inactivityPeriod]);

  return { users, inactivityPeriod };
};

export default useMockData;
