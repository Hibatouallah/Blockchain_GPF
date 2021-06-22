
def test_promoteur(promoteur):
    """
    Test if the contract is correctly deployed.
    """
    assert promoteur.authentification() == 5
