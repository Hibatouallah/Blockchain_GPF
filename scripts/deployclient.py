from brownie import accounts,Client


def main():
    """ Simple deploy script for our two contracts. """
    accounts[0].deploy(Client)
   