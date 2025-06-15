#!/usr/bin/env python3
"""
Tambola (Indian Housie) Game
A complete implementation of the popular Indian bingo game
"""

import time
import random
from ticket import Ticket
from caller import Caller
from winner_checker import WinnerChecker

class TambolaGame:
    """Main game class that orchestrates the Tambola game"""
    
    def __init__(self):
        self.caller = Caller()
        self.winner_checker = WinnerChecker()
        self.players = []
        self.game_winners = {}  # Track winners for each prize category
        self.game_active = True
    
    def setup_game(self):
        """Setup the game with players"""
        print("🎪 Welcome to Tambola (Indian Housie)! 🎪")
        print("=" * 50)
        
        # Get number of players
        while True:
            try:
                num_players = int(input("Enter number of players (1-6): "))
                if 1 <= num_players <= 6:
                    break
                else:
                    print("Please enter a number between 1 and 6.")
            except ValueError:
                print("Please enter a valid number.")
        
        # Create players and their tickets
        for i in range(num_players):
            if num_players == 1:
                name = input("Enter your name: ").strip() or f"Player {i+1}"
            else:
                name = input(f"Enter name for Player {i+1}: ").strip() or f"Player {i+1}"
            
            ticket = Ticket(name)
            self.players.append({
                'name': name,
                'ticket': ticket,
                'wins': []
            })
        
        # Display all tickets
        print("\n" + "="*60)
        print("GAME TICKETS")
        print("="*60)
        for player in self.players:
            player['ticket'].display()
        
        input("\nPress Enter to start the game...")
    
    def play_round(self):
        """Play one round (call one number)"""
        if not self.caller.has_more_numbers():
            print("All numbers have been called!")
            return False
        
        # Call next number
        number = self.caller.call_next_number()
        if number is None:
            return False
        
        print(f"\n{'='*60}")
        self.caller.announce_number(number)
        print(f"{'='*60}")
        
        # Mark number on all tickets and check for wins
        for player in self.players:
            ticket = player['ticket']
            previous_wins = player['wins'].copy()
            
            # Mark the number if it exists on ticket
            if ticket.mark_number(number):
                print(f"✅ {player['name']} has number {number}!")
            
            # Check for new wins
            new_wins, all_wins = self.winner_checker.check_new_wins(ticket, previous_wins)
            
            if new_wins:
                self.winner_checker.display_win_announcement(player['name'], new_wins)
                player['wins'] = all_wins
                
                # Record winners for each category
                for win in new_wins:
                    if win not in self.game_winners:
                        self.game_winners[win] = []
                    self.game_winners[win].append(player['name'])
        
        # Display current state
        self.display_game_state()
        
        # Check if game should continue
        if 'full_house' in self.game_winners:
            print("🏁 Full House achieved! Game Over! 🏁")
            return False
        
        return True
    
    def display_game_state(self):
        """Display current game state"""
        print(f"\nNumbers remaining: {self.caller.get_remaining_count()}")
        
        # Show called numbers
        self.caller.display_called_numbers()
        
        # Show current tickets
        print("\n" + "="*60)
        print("CURRENT TICKETS")
        print("="*60)
        for player in self.players:
            player['ticket'].display()
            if player['wins']:
                print(f"🏆 {player['name']}'s wins: {', '.join([self.winner_checker.get_win_description(win) for win in player['wins']])}")
    
    def display_final_results(self):
        """Display final game results"""
        print("\n" + "🎊"*60)
        print("FINAL RESULTS")
        print("🎊"*60)
        
        if not self.game_winners:
            print("No winners in this game!")
            return
        
        # Display winners by category
        prize_hierarchy = self.winner_checker.get_prize_hierarchy()
        
        for win_type, description in prize_hierarchy:
            if win_type in self.game_winners:
                winners = self.game_winners[win_type]
                print(f"\n🏆 {description}:")
                for winner in winners:
                    print(f"   🎯 {winner}")
        
        print("\n" + "🎊"*60)
        print("Thanks for playing Tambola!")
        print("🎊"*60)
    
    def run_game(self):
        """Main game loop"""
        self.setup_game()
        
        print("\n🎮 Starting Tambola Game! 🎮")
        print("Numbers will be called automatically...")
        
        try:
            while self.game_active:
                input("\nPress Enter to call next number (or Ctrl+C to quit)...")
                
                if not self.play_round():
                    self.game_active = False
                    break
        
        except KeyboardInterrupt:
            print("\n\nGame interrupted by user.")
        
        finally:
            self.display_final_results()

def main():
    """Main function to start the game"""
    game = TambolaGame()
    game.run_game()

if __name__ == "__main__":
    main()
